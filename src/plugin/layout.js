/**
 * @file layout.js
 * @author clark-t (clarktanglei@163.com)
 */

const imageSize = require('../utils/image-size')
const path = require('path')
const fs = require('fs')
const renderer = require('../utils/renderer')

const css = fs.readFileSync(path.resolve(__dirname, '../builder/dist/index.css'))

/* eslint-disable */
const navbar = [
  {
    "name": "首页",
    "url": "/index.html",
    "width": 32
  },
  {
    "name": "学习",
    "width": 32,
    "children": [
      {
        "name": "使用文档",
        "url": "/guide/index.html",
        "width": 64
      },
      {
        "name": "组件列表",
        "url": "/components/index.html",
        "width": 64
      },
      {
        "name": "API",
        "url": "/api/index.html"
      },
      {
        "name": "Codelab",
        "url": "/codelab/index.html",
        "width": 60
      }
    ]
  },
  {
    "name": "帮助",
    "url": "/help",
    "width": 32
  },
  {
    "name": "常用链接",
    "children": [
      {
        "name": "MIP 官方博客"
      },
      {
        "name": "MIP 代码校验工具"
      }
    ],
    "width": 82
  },
  {
    "name": "GitHub",
    "url": "https://github.com/mipengine/mip2",
    "width": 50
  }
]

/* eslint-enable */

module.exports = class Layout {
    apply(on, app) {
        let cachedChangedFileList = [];

        // 只对存在变化的文档对象做 mip 处理

        on(app.STAGES.CREATE_DOC_STORE_OBJECT, obj => {
            cachedChangedFileList.push(obj);
        }, 10100);

        on(app.STAGES.DONE, async () => {
          await Promise.all(cachedChangedFileList.map(async docInfo => {
            let {html: originalHtml, url, info, chapters, path} = docInfo;

            // 提取样式
            let {style, html} = extractStyle(originalHtml);

            // html 组件替换
            html = heading(html);
            html = link(html, app);
            html = await image(html, app);
            html = video(html, app);

            // 生成 menu 和 chapter
            let menuInfo = await app.getMenuByUrl(url);

            let last
            let next
            try {
              last = getPre(path, menuInfo)
            } catch (e) {
              console.log('===== get pre error =====')
              console.log(path)
              console.log(e)
              console.log('-------------------------')
            }

            try {
              next = getNext(path, menuInfo)
            } catch (e) {
              console.log('==== get next error =====')
              console.log(path)
              console.log(e)
              console.log('-------------------------')
            }


            // let menuHtml = menuInfo && engine.render('infinity-menu', {
            //     menu: menuInfo,
            //     level: 0
            // });

            // let chapterHtml = chapters && engine.render('infinity-chapters', {
            //     chapters,
            //     level: 0
            // });

            let newhtml = renderer.render('layout-doc', {
              title: info.title || 'MIP2 官网',
              description: info.description || '',
              keywords: 'MIP2',
              originUrl: '',
              host: 'https://mip-project.github.io',
              navbar: navbar,
              content: html,
              css: css,
              menu: menuInfo,
              chapters: chapters || {},
              breadcrumbs: info.breadcrumbs,
              url: url,
              navIndex: url.indexOf('/guide') === 0
                ? 1
                : url.indexOf('/components') === 0 ? 2 : 0,
              development: process.env.NODE_ENV === 'development',
              last: last,
              next: next
              // menu: menuHtml || '',
              // chapters: chapterHtml || '',
              // baseStyle: markdownCss,
              // layoutStyle: layoutCss,
            });

            docInfo.html = newhtml;

            await app.store.set('doc', docInfo.path, docInfo);
          }))
          .then(() => {
              cachedChangedFileList = [];
          })

        }, 99999);
    }
};

/**
 * 将 文档中的 heading 中的 data-hash 替换成 id
 * 以激活浏览器默认的页面哈希跳转行为
 *
 * @param {string} html html
 * @return {string} 替换好的 html
 */
function heading(html) {
    return html.replace(
        /<h([1-9])([\s\S]+?)data-hash="#(.+?)">/mg,
        function (full, level, attr, hash) {
            return `<h${level} id="${hash}">`;
        }
    );
}

function link(html, app) {
  return html.replace(
    /<a([\s\S]+?)href="(.+?)"([\s\S]*?)>/mg,
    function (full, attr1, href, attr2) {
      if (/^[a-z.]/.test(href)) {
        return `<a data-type="mip" href="${href}">`
      }
        // if (/^\/(guide|pwa|codelab)/.test(href)) {
        //     // let host = app.config.host;
        //     // href = `${host}/mip${href}`;
        //     // href = `/${href}`;
        //     return `<a data-type="mip" href="${href}">`;
        // }

      return full;
    }
  );
}

/**
 * 将 文档中的 img 替换成 mip 组件
 *
 * @param {string} html html
 * @param {Kram} app kram 对象
 * @return {string} 替换好 img 的 html
 */
async function image(html, app) {
    const imgRegExp = /<img([\s\S]+?)src="([^ "]*?)"([\s\S]*?)>/mg;

    let labels = html.match(imgRegExp);

    if (!labels) {
        return html;
    }

    let srcs = labels.map(label => label.replace(imgRegExp, '$2').replace(/["']/g, ''));
    // let sizes = {
    //     width: 320,
    //     height: 320
    // };
    let sizes = await Promise.all(srcs.map(
        src => getImageSize(
            src.replace(/^\//, ''),
            app.config.rootDir,
            app.logger
        )
    ));

    return html.replace(imgRegExp, (full, attr1, src) => {
        src = src.replace(/^\//, '')

        let {width, height} = sizes.shift()

        if (!/^http/.test(src) && !/^\/\//.test(src)) {
          let host = app.config.host
          src = `${host}/${src}`
        }

        let layout

        if (width <= 320) {
          layout = 'fixed'
        } else {
          layout = 'responsive'
        }

        /* eslint-disable max-len */
        if (/\.gif($|\?|#)/.test(src)) {
            return `<mip-anim layout="${layout}" width="${width}" height="${height}" src="${src}"></mip-anim>`;
        }

        return `<mip-img layout="${layout}" width="${width}" height="${height}" src="${src}"></mip-img>`;
        /* eslint-enable max-len */
    });
}

/**
 * 将 文档中的 video 替换成 mip 组件
 *
 * @param {string} html html
 * @param {Kram} app kram 对象
 * @return {string} 替换好 video 的 html
 */
function video(html, app) {
    return html.replace(
        /<video([\s\S]+?)src="(.+?)"([\s\S]*?)>([\s\S]*?)<\/video>/mg,
        function (full, attr1, src, attr2, text) {
            let attr = attr1 + attr2;
            let widthMatch = attr.match(/width="(.*?)"/m);
            let heightMatch = attr.match(/height="(.*?)"/m);

            let width = widthMatch && widthMatch.length ? widthMatch[1] : '320';
            let height = heightMatch && heightMatch.length ? heightMatch[1] : '320';

            if (!/^http/.test(src) && !/^\/\//.test(src)) {
                let host = app.config.host;
                src = `${host}${src}`;
            }
            /* eslint-disable max-len */
            return `<mip-video controls loop muted width="${width}" height="${height}" src="${src}">${text}</mip-video>`;
            /* eslint-enable max-len */
        }
    );
}

/**
 * 提取 <style> 标签里的 css 进行合并
 *
 * @param {string} html html
 * @return {Object} 去除 style 标签的 html 和提取好的 css
 */
function extractStyle(html) {
    let style = [];
    html = html.replace(
        /<style(.*?)>([\s\S]+?)<\/style>/mg,
        function (str, attr, styleCode) {
            style.push(styleCode);
            return '';
        }
    );

    return {style, html};
}

/**
 * 获取图片尺寸因为 mip 要求
 *
 * @param {string} src 图片 url 地址
 * @param {string} basePath 本地图片的 base path
 * @param {Object} logger logger
 * @return {Object} 宽高对象
 */
async function getImageSize(src, basePath = '', logger) {
    try {
        if (/^http/.test(src)) {
            return await imageSize.getRemoteImageSize(src, logger);
        }

        if (/\s+/.test(src) || src === '') {
            return {width: 320, height: 320};
        }

        if (basePath) {
            src = path.resolve(basePath, src);
        }

        // console.log(src)

        return await imageSize.getLocalImageSize(src, logger);
    }
    catch (e) {
        return {width: 320, height: 320};
    }

}

function getPre(current, menu) {
  let parent = getParent(current, menu);
  if (!parent) {
      return null;
  }
  let index = getIndex(current, parent.children || parent);
  if (index > 0) {
      let pre = (parent.children || parent)[index - 1];
      while (pre.children) {
          pre = pre.children[pre.children.length - 1];
      }
      return pre;
  }
  while (parent) {
      let currParent = getParent(parent.path, menu);
      if (!currParent) {
          break;
      }
      let index = getIndex(parent.path, currParent.children || currParent);
      if (index > 0) {
          let pre = (currParent.children || currParent)[index - 1];
          while (pre.children) {
              pre = pre.children[pre.children.length - 1];
          }
          return pre;
      }
      parent = currParent;
  }
  return null;
}

function getNext(current, menu) {
  let parent = getParent(current, menu);
  if (!parent) {
      return null;
  }
  let index = getIndex(current, parent.children || parent);
  let list = parent.children || parent;
  if (index < (list.length - 1)) {
      let next = list[index + 1];
      while (next.children) {
          next = next.children[0];
      }
      return next;
  }
  while (parent) {
      let currParent = getParent(parent.path, menu);
      if (!currParent) {
          break;
      }
      let list = currParent.children || currParent;
      let index = getIndex(parent.path, list);
      if (index < (list.length - 1)) {
          let next = list[index + 1];
          while (next.children) {
              next = next.children[0];
          }
          return next;
      }
      parent = currParent;
  }
  return null;
}

function getParent(path, menu) {
    let list;
    if (Array.isArray(menu)) {
        list = menu;
    }
    else if (menu.children) {
        list = menu.children;
    }
    if (getItem(path, list)) {
        return menu;
    }
    for (let i = 0, max = list.length; i < max; i++) {
        if (list[i].children) {
            let childParent = getParent(path, list[i]);
            if (childParent) {
                return childParent;
            }
        }
    }
    return null;
}

function getItem(path, list) {
    for (let i = 0, max = list.length; i < max; i++) {
        if (list[i].path === path) {
            return list[i];
        }
    }
    return null;
}

function getIndex(path, list) {
    for (let i = 0, max = list.length; i < max; i++) {
        if (list[i].path === path) {
            return i;
        }
    }
    return -1;
}




