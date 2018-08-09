/**
 * @file layout.js
 * @author clark-t (clarktanglei@163.com)
 */

const imageSize = require('../utils/image-size')
const path = require('path')
const fs = require('fs')
const renderer = require('../utils/renderer')
const navbar = require('../data/navbar')
// const migPageProcess = require('../utils/mip-img-process')

const css = fs.readFileSync(path.resolve(__dirname, '../style/dist/index.css'))

module.exports = class Layout {
  apply (on, app) {
    let cachedChangedFileList = []

    // 只对存在变化的文档对象做 mip 处理

    on(app.STAGES.CREATE_DOC_STORE_OBJECT, obj => {
      cachedChangedFileList.push(obj)
    }, 10100)

    on(app.STAGES.DONE, async () => {
      await Promise.all(cachedChangedFileList.map(async docInfo => {
        let {html: originalHtml, url, info, chapters, path} = docInfo

        // 提取样式
        let {style, html} = extractStyle(originalHtml)

        // html 组件替换
        html = heading(html)
        html = link(html, app)
        html = await image(html, app)
        html = video(html, app)

        // 生成 menu 和 chapter
        let menuInfo = await app.getMenuByUrl(url)

        let last // 上一页
        let next // 下一页
        let codelabMenu // codelab 内的stepMenu
        let layoutName // 模板名称
        // 文档编辑、反馈链接
        let editLink = 'https://github.com/mipengine/mip2/edit/master/' + path
        let feedbackLink = 'https://github.com/mipengine/mip2/issues/new' + '?title=反馈:' + path

        // codelab 单独处理
        if (url.indexOf('/codelabs') === 0) {
          layoutName = 'layout-codelab-detail'
          codelabMenu = menuInfo.find(item => {
            let targetPath = 'docs' + url.slice(0, url.lastIndexOf('/'))
            return item.path === targetPath
          })

          last = codelabMenu ? getPre(path, codelabMenu) : null
          next = codelabMenu ? getNext(path, codelabMenu) : null
        } else {
          layoutName = 'layout-doc'
          last = getPre(path, menuInfo)
          next = getNext(path, menuInfo)
        }

        let breadcrumbs

        try {
          breadcrumbs = getBreadcrumbs(path, menuInfo)
          if (!breadcrumbs.length) {
            breadcrumbs = undefined
          }

          // console.log(breadcrumbs.map(i => i.name).join(','))
        } catch (e) {
          console.log('==== get breadcrumbs error =====')
          console.log(path)
          console.log(e)
          console.log('-------------------------')
        }

        let secondNavbarTitle

        if (/\/guide\//.test(url)) {
          secondNavbarTitle = '使用文档'
        } else if (/\/components\//.test(url)) {
          secondNavbarTitle = '组件列表'
        } else if (/\/api\//.test(url)) {
          secondNavbarTitle = 'API'
        } else if (/\/codelabs\/(?!(index))/) {
          secondNavbarTitle = codelabMenu ? codelabMenu.info.name : 'Codelabs'
        }

        let newhtml = renderer.render(layoutName, {
          title: 'MIP 文档_移动网页加速器_MIP(Mobile Instant Pages_)' + (info.title || ''),
          description: info.description || '',
          keywords: 'MIP2',
          originUrl: '',
          host: 'https://mip-project.github.io',
          navbar: navbar,
          content: html,
          css: css + style.join(''),
          menu: menuInfo,
          codelabMenu: codelabMenu,
          chapters: chapters || {},
          // breadcrumbs: info.breadcrumbs,
          url: url,
          development: process.env.NODE_ENV === 'development',
          last: last,
          next: next,
          breadcrumbs: breadcrumbs || [],
          editLink: editLink,
          feedbackLink: feedbackLink,
          secondNavbarTitle: secondNavbarTitle
          // menu: menuHtml || '',
          // chapters: chapterHtml || '',
          // baseStyle: markdownCss,
          // layoutStyle: layoutCss,
        })

        docInfo.html = newhtml

        await app.store.set('doc', docInfo.path, docInfo)
      }))
        .then(() => {
          cachedChangedFileList = []
        })
    }, 99999)
  }
}

/**
 * 将 文档中的 heading 中的 data-hash 替换成 id
 * 以激活浏览器默认的页面哈希跳转行为
 *
 * @param {string} html html
 * @return {string} 替换好的 html
 */
function heading (html) {
  return html.replace(
    /<h([1-9])([\s\S]+?)data-hash="#(.+?)">/mg,
    function (full, level, attr, hash) {
      return `<h${level} id="${hash}">`
    }
  )
}

function link (html, app) {
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

      return full
    }
  )
}

/**
 * 将 文档中的 img 替换成 mip 组件
 *
 * @param {string} html html
 * @param {Kram} app kram 对象
 * @return {string} 替换好 img 的 html
 */
async function image (html, app) {
  const imgRegExp = /<img([\s\S]+?)src="([^ "]*?)"([\s\S]*?)>/mg

  let labels = html.match(imgRegExp)

  if (!labels) {
    return html
  }

  let srcs = labels.map(label => label.replace(imgRegExp, '$2').replace(/["']/g, ''))
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
  ))

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
      layout = 'container'
    }

    // let {layout, addClass} = migPageProcess.processMipImgStyle(src, width, height)

    /* eslint-disable max-len */
    if (/\.gif($|\?|#)/.test(src)) {
      return `
            <mip-anim
              layout="${layout}"
              width="${width}"
              height="${height}"
              src="${src}"
            ></mip-anim>
            `
    }

    return `
        <div class="md-img-wrapper">
          <div class="md-img-wrapper-child">
            <mip-img
              layout="${layout}"
              width="${width}"
              height="${height}"
              src="${src}"
              popup
            ></mip-img>
          </div>
        </div>
        `
    /* eslint-enable max-len */
  })
}

/**
 * 将 文档中的 video 替换成 mip 组件
 *
 * @param {string} html html
 * @param {Kram} app kram 对象
 * @return {string} 替换好 video 的 html
 */
function video (html, app) {
  return html.replace(
    /<video([\s\S]+?)src="(.+?)"([\s\S]*?)>([\s\S]*?)<\/video>/mg,
    function (full, attr1, src, attr2, text) {
      let attr = attr1 + attr2
      let widthMatch = attr.match(/width="(.*?)"/m)
      let heightMatch = attr.match(/height="(.*?)"/m)

      let width = widthMatch && widthMatch.length ? widthMatch[1] : '320'
      let height = heightMatch && heightMatch.length ? heightMatch[1] : '320'

      if (!/^http/.test(src) && !/^\/\//.test(src)) {
        let host = app.config.host
        src = `${host}${src}`
      }
      /* eslint-disable max-len */
      return `<mip-video controls loop muted width="${width}" height="${height}" src="${src}">${text}</mip-video>`
      /* eslint-enable max-len */
    }
  )
}

/**
 * 提取 <style> 标签里的 css 进行合并
 *
 * @param {string} html html
 * @return {Object} 去除 style 标签的 html 和提取好的 css
 */
function extractStyle (html) {
  let style = []
  html = html.replace(
    /<style(.*?)>([\s\S]+?)<\/style>/mg,
    function (str, attr, styleCode) {
      style.push(styleCode)
      return ''
    }
  )

  return {style, html}
}

/**
 * 获取图片尺寸因为 mip 要求
 *
 * @param {string} src 图片 url 地址
 * @param {string} basePath 本地图片的 base path
 * @param {Object} logger logger
 * @return {Object} 宽高对象
 */
async function getImageSize (src, basePath = '', logger) {
  try {
    if (/^http/.test(src)) {
      return await imageSize.getRemoteImageSize(src, logger)
    }

    if (/\s+/.test(src) || src === '') {
      return {width: 320, height: 320}
    }

    if (basePath) {
      src = path.resolve(basePath, src)
    }

    // console.log(src)

    return await imageSize.getLocalImageSize(src, logger)
  } catch (e) {
    return {width: 320, height: 320}
  }
}

function getPre (current, menu) {
  try {
    let parent = getParent(current, menu)
    if (!parent) {
      return null
    }
    let index = getIndex(current, parent.children || parent)
    if (index > 0) {
      let pre = (parent.children || parent)[index - 1]
      while (pre.children) {
        pre = pre.children[pre.children.length - 1]
      }
      return pre
    }
    while (parent) {
      let currParent = getParent(parent.path, menu)
      if (!currParent) {
        break
      }
      let index = getIndex(parent.path, currParent.children || currParent)
      if (index > 0) {
        let pre = (currParent.children || currParent)[index - 1]
        while (pre.children) {
          pre = pre.children[pre.children.length - 1]
        }
        return pre
      }
      parent = currParent
    }
    return null
  } catch (e) {
    console.log('===== get pre error =====')
    console.log(path)
    console.log(e)
    console.log('-------------------------')
  }
}

function getNext (current, menu) {
  try {
    let parent = getParent(current, menu)
    if (!parent) {
      return null
    }
    let index = getIndex(current, parent.children || parent)
    let list = parent.children || parent
    if (index < (list.length - 1)) {
      let next = list[index + 1]
      while (next.children) {
        next = next.children[0]
      }
      return next
    }
    while (parent) {
      let currParent = getParent(parent.path, menu)
      if (!currParent) {
        break
      }
      let list = currParent.children || currParent
      let index = getIndex(parent.path, list)
      if (index < (list.length - 1)) {
        let next = list[index + 1]
        while (next.children) {
          next = next.children[0]
        }
        return next
      }
      parent = currParent
    }
    return null
  } catch (e) {
    console.log('==== get next error =====')
    console.log(path)
    console.log(e)
    console.log('-------------------------')
  }
}

function getParent (path, menu) {
  let list
  if (Array.isArray(menu)) {
    list = menu
  } else if (menu.children) {
    list = menu.children
  }
  if (getItem(path, list)) {
    return menu
  }
  for (let i = 0, max = list.length; i < max; i++) {
    if (list[i].children) {
      let childParent = getParent(path, list[i])
      if (childParent) {
        return childParent
      }
    }
  }
  return null
}

function getItem (path, list) {
  for (let i = 0, max = list.length; i < max; i++) {
    if (list[i].path === path) {
      return list[i]
    }
  }
  return null
}

function getIndex (path, list) {
  for (let i = 0, max = list.length; i < max; i++) {
    if (list[i].path === path) {
      return i
    }
  }
  return -1
}

function getBreadcrumbs (path, menu) {
  return path.split('/').map((str, i, arr) => arr.slice(0, i + 1).join('/'))
    .reduce((obj, key) => {
      let menu = obj.menu

      let list
      if (Array.isArray(menu)) {
        list = menu
      } else if (menu.children) {
        list = menu.children
      }

      let item = getItem(key, list)

      if (item) {
        obj.list.push(item)
        obj.menu = item.children
      }

      return obj
    }, {list: [], menu: menu}).list
}
