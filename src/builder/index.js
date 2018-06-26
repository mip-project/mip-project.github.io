/**
 * @file builder server
 * @author clark-t (clarktanglei@163.com)
 */

const Koa = require('koa')
const Router = require('koa-router')
const path = require('path')
const webpack = require('webpack')
const middleware = require('koa-webpack')
const webpackConfig = require('./webpack.config')
const fs = require('fs-extra')
const etpl = require('etpl')
const {getFilenameFromUrl} = require('webpack-dev-middleware/lib/util')

let etplEngine = new etpl.Engine({
    commandOpen: '{{',
    commandClose: '}}',
    strip: true,
    namingConflict: 'override',
    dir: path.resolve(__dirname, './views')
})

class Server {
  constructor ({
    port = 8229
  } = {}) {
    this.port = port
    this.app = new Koa()
  }

  run () {
    this.router = new Router()
    this.router
      .get('/:id([^\\.]+\\.html)', ...this.html())
      .get('*', ...this.pack())
    this.app.use(this.router.routes())
      .listen(this.port)
  }

  html () {
    return [
      async (ctx, next) => {
        let filename = path.resolve(__dirname, 'pages', ctx.params.id || 'index.html')

        try {
          let html = await fs.readFile(filename, 'utf-8')
          let sidebarHtml = await fs.readFile(path.resolve(__dirname, 'pages', 'sidebar.html'), 'utf-8')
          let cssFilename = getFilenameFromUrl('/', this.compiler, `/index.css`)
          await this.wait
          let css = this.midd.devMiddleware.fileSystem.readFileSync(cssFilename, 'utf-8')

          etplEngine.loadFromFile(path.resolve(__dirname, './views/markdown-paginator.tpl'))
          etplEngine.loadFromFile(path.resolve(__dirname, './views/markdown-breadcrumb.tpl'))
          etplEngine.loadFromFile(path.resolve(__dirname, './views/markdown-toolbar.tpl'))
          let renderer = etplEngine.loadFromFile(path.resolve(__dirname, './views/layout.tpl'))
          ctx.body = renderer({
            css,
            content: html,
            last: {
              url: 'http://www.baidu.com',
              title: '提交组件到官方组件仓库'
            },
            next: {
              url: 'http://www.baidu.com',
              title: 'mip-app-banner App 调起组件'
            },
            list: [
              {
                title: '进阶教程'
              },
              {
                title: 'Service Worker'
              },
              {
                title: '配置缓存文件'
              }
            ],
            siderbar: sidebarHtml
          })
        }
        catch (e) {
          ctx.throw(e)
          // ctx.throw(404, 'no such file in: ' + filename)
        }

      }
    ]
  }

  pack () {
    this.compiler = webpack(webpackConfig)
    this.wait = middleware({
      compiler: this.compiler,
      devMiddleware: {
        publicPath: '/',
        stats: 'errors-only'
      },
      hotClient: false
    })
    .then(midd => {
      this.midd = midd
    })

    return [
      async (ctx, next) => {
        await this.wait
        await this.midd(ctx, next)
      }
    ]
  }
}

let app = new Server()
app.run()
