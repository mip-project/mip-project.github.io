/**
 * @file static.js
 * @author clark-t (clarktanglei@163.com)
 */

const fs = require('fs-extra')
const path = require('path')
const renderer = require('../utils/renderer')

const css = fs.readFileSync(path.resolve(__dirname, '../style/dist/index.css'))
const navbar = require('../data/navbar')

module.exports = class Static {
  apply (on, app) {
    let cachedChangedFileList = []
    let dist = path.resolve(process.cwd())

    on(app.STAGES.CREATE_DOC_STORE_OBJECT, obj => {
      cachedChangedFileList.push(obj)
    }, 10150)

    on(app.STAGES.DONE, async () => {
      await Promise.all(cachedChangedFileList.map(async obj => {
        let pathname = path.resolve(dist, obj.url.replace(/^\//, '').replace(/\.html$/, '') + '.html')
        await fs.ensureDir(path.dirname(pathname))
        await fs.writeFile(pathname, obj.html, 'utf-8')
        if (obj.isFirst) {
          let url = obj.url.replace(/^\//, '').split('/').slice(0, 1).join('/') + '/index.html'
          let indexpath = path.resolve(dist, url)
          let info = await app.getDocByUrl('/' + url)
          if (!info) {
            await fs.writeFile(indexpath, obj.html, 'utf-8')
          } else {
            await fs.writeFile(indexpath, info.html, 'utf-8')
          }
        }
      }))

      let menuInfo = await app.getMenuByUrl('/codelabs')

      // 静态化首页
      let html = renderer.render('layout-index', {
        title: 'MIP官网_移动网页加速器_MIP(Mobile Instant Pages)',
        description: 'MIP（Mobile Instant Pages - 移动网页加速器）是一套应用于移动网页的开放性技术标准，使用 MIP无需等待加载，页面内容将以更友好的方式瞬时到达用户。',
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

      // codelab 首页
      let htmlCodelab = renderer.render('layout-codelab', {
        title: 'MIP 文档_移动网页加速器_MIP(Mobile Instant Pages) | CODELAB',
        description: '我们在 Codelab 中提供了一系列基于 MIP 的编程小项目，内容包括项目起步、配置教学、功能实现等等',
        keywords: 'Codelab',
        originUrl: '',
        host: 'https://mip-project.github.io',
        navbar: navbar,
        css: css,
        menu: menuInfo,
        chapters: {},
        url: '/codelabs/index.html',
        navIndex: 3,
        development: process.env.NODE_ENV === 'development'
      })

      await fs.writeFile(path.resolve(dist, 'index.html'), html, 'utf-8')
      await fs.writeFile(path.resolve(dist, 'codelabs/index.html'), htmlCodelab, 'utf-8')
    }, 999999)
  }
}
