/**
 * @file static.js
 * @author clark-t (clarktanglei@163.com)
 */

const fs = require('fs-extra');
const path = require('path');
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
    "name": "Codelab",
    "url": "/codelab",
    "width": 60
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
    "url": "/github",
    "width": 50
  }
]

/* eslint-enable */

module.exports = class Static {
    apply(on, app) {
        let cachedChangedFileList = [];
        let dist = path.resolve(process.cwd());

        on(app.STAGES.CREATE_DOC_STORE_OBJECT, obj => {
            cachedChangedFileList.push(obj);
        }, 10150);

        on(app.STAGES.DONE, async () => {
            cachedChangedFileList.forEach(async obj => {
                let pathname = path.resolve(dist, obj.url.replace(/^\//, '').replace(/\.html$/, '') + '.html')
                await fs.ensureDir(path.dirname(pathname))
                await fs.writeFile(pathname, obj.html, 'utf-8')
                if (obj.isFirst) {
                  let url = obj.url.replace(/^\//, '').split('/').slice(0, 1).join('/') + '/index.html'
                  let indexpath = path.resolve(dist, url)
                  let info = await app.getDocByUrl('/' + url)
                  if (!info) {
                    await fs.writeFile(indexpath, obj.html, 'utf-8')
                  }
                }
            })

            // 静态化首页
            var html = renderer.render('layout-index', {
              title: 'MIP2 官网',
              description: 'MIP2 官网',
              keywords: 'MIP2',
              originUrl: '',
              host: 'https://mip-project.github.io',
              navbar: navbar,
              css: css,
              menu: {},
              chapters: {},
              url: '',
              navIndex: 0,
              development: process.env.NODE_ENV === 'development'
            })

            await fs.writeFile(path.resolve(dist, 'index.html'), html, 'utf-8');

        }, 999999);
    }
};
