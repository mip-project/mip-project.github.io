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
      .get('/index.html)', ...this.html('index'))
      .get('/codelab/:id([^\\.]+\\.html)', ...this.html('codelab'))
      .get('/docs/:id([^\\.]+\\.html)', ...this.html('docs'))
      .get('*', ...this.pack())
    this.app.use(this.router.routes())
      .listen(this.port)
  }

  html (type) {
    return [
      async (ctx, next) => {
        try {
          await this.wait
          let cssFilename = getFilenameFromUrl('/', this.compiler, `/index.css`)
          let css = this.midd.devMiddleware.fileSystem.readFileSync(cssFilename, 'utf-8')

          let navbar = await fs.readFile(path.resolve(__dirname, 'data', 'navbar.json'), 'utf-8')

          let data = {
            css,
            navbar: JSON.parse(navbar)
          }

          let etplEngine = new etpl.Engine({
            commandOpen: '{{',
            commandClose: '}}',
            strip: true,
            namingConflict: 'override',
            dir: path.resolve(__dirname, './views')
          })

          etplEngine.loadFromFile(path.resolve(__dirname, './views/layout-navbar.tpl'))
          etplEngine.loadFromFile(path.resolve(__dirname, './views/layout.tpl'))

          if (type === 'codelab') {
            let filename = path.resolve(__dirname, 'pages/codelab', ctx.params.id || 'index.html')
            let content = await fs.readFile(filename, 'utf-8')
            data.content = content

            ctx.body = await this.codelab(etplEngine, data)
          } else if (type === 'index') {
            ctx.body = await this.index(etplEngine, data)
          } else {
            let filename = path.resolve(__dirname, 'pages/docs', ctx.params.id || 'index.html')
            let content = await fs.readFile(filename, 'utf-8')
            data.content = content

            ctx.body = await this.doc(etplEngine, data)
          }
        }
        catch (e) {
          ctx.throw(e)
          // ctx.throw(404, 'no such file in: ' + filename)
        }

      }
    ]
  }

  async doc (etplEngine, data) {
    let sidebarHtml = await fs.readFile(path.resolve(__dirname, 'pages/docs', 'sidebar.html'), 'utf-8')

    etplEngine.loadFromFile(path.resolve(__dirname, './views/markdown-paginator.tpl'))
    etplEngine.loadFromFile(path.resolve(__dirname, './views/markdown-breadcrumb.tpl'))
    etplEngine.loadFromFile(path.resolve(__dirname, './views/markdown-toolbar.tpl'))

    let renderer = etplEngine.loadFromFile(path.resolve(__dirname, './views/layout-doc.tpl'))

    return renderer(Object.assign({}, data, {
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
    }))
  }

  async codelab (etplEngine, data) {
    let renderer = etplEngine.loadFromFile(path.resolve(__dirname, './views/layout-codelab.tpl'))

    return renderer(Object.assign({}, data, {
    }))
  }

  async index (etplEngine, data) {
    let renderer = etplEngine.loadFromFile(path.resolve(__dirname, './views/layout-index.tpl'))
    return renderer(Object.assign({}, data, {
    }))
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
