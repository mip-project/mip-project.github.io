/**
 * @file component-preview.js
 * @author clark-t (clarktanglei@163.com)
 */

const path = require('path')
const fs = require('fs-extra')
const cheerio = require('cheerio')

module.exports = class ComponentPreview {
  apply (on, app) {
    on(app.STAGES.CREATE_DOC_STORE_OBJECT, async obj => {
      // 只针对 components 下的符合 文档格式的组件做预览效果
      if (!/^\/components\//.test(obj.url)) {
        return
      }

      let fileInfo = await app.getFileInfo(obj.path)

      if (!fileInfo || !fileInfo.file) {
        return
      }

      let matchScript = fileInfo.file.match(/\s所需脚本\|(.*?)\s/m)

      if (!matchScript) {
        return
      }

      let script = matchScript[1].trim()

      if (/^https?.+?\.js$/.test(script)) {
        script = `<script src="${script}"></script>`
      } else {
        script = ''
      }

      let matchExample = fileInfo.file.match(/(\r\n|\n\r|\r|\n)## 示例\s([\s\S]+?)(\r\n|\n\r|\r|\n)## 属性\s/)

      if (!matchExample) {
        return
      }

      let exampleText = matchExample[2]

      if (!exampleText) {
        return
      }

      let matchCases = exampleText.match(/\s```html\s([\s\S]+?)\s```\s/g)

      if (!matchCases) {
        return
      }

      let dist = path.resolve(process.cwd())

      let theCases = await Promise.all(
        matchCases.map(async (theCase, i) => {
          theCase = theCase
            .replace(/^\s```html\s/, '')
            .replace(/```\s$/, '')

          let $ = cheerio.load(theCase, {decodeEntities: false})
          let length = $('body').children().length

          if (length === 0) {
            return ''
          }

          let width = 320
          let height = 568

          // if (length === 1) {
          //   let node = $('body').children().first()


          //   if (node && node.attr && node.attr('width')) {
          //     width = node.attr('width')
          //   }

          //   if (node && node.attr && node.attr('height')) {
          //     height = node.attr('height')
          //   }
          // }

          // console.log('------------------')

          let html = `
            <!DOCTYPE html>
            <html mip>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
              <title>测试</title>
              <meta name="description" content="">
              <link rel="canonical" href="">
              <link rel="stylesheet" type="text/css" href="https://c.mipcdn.com/static/v2/mip.css">
            </head>
            <body>
              ${theCase}
              <script src="https://c.mipcdn.com/static/v2/mip.js"></script>
              ${script}
            </body>
          `

          let caseUrl = obj.url.replace(/^\//, '').replace(/\.html$/, '') + `-case-${i}.html`
          let pathname = path.resolve(dist, caseUrl)
          await fs.ensureDir(path.dirname(pathname))
          await fs.writeFile(pathname, html, 'utf-8')
          return `<mip-iframe width="${width}" height="${height}" src="${app.config.host}/${caseUrl}"></mip-iframe>`
        })
      )

      // matchCases.map(theCase => {
      //   theCase = theCase
      //     .replace(/^\s```html\s/, '')
      //     .replace(/```\s$/, '')

      //   let html = `${theCase}<script src="https://c.mipcdn.com/static/v2/mip.js"></script>${script}`.replace(/"/g, '&quot;')
      //   return `<mip-iframe width="400" height="300" src="${app.config.host}/${caseUrl}"></mip-iframe>`
      // })

      let htmlBlocks = obj.html.replace(
        /<h([1-9])([\s\S]+?)data-hash="#(.+?)">/mg,
        function (full, level, attr, hash) {
          return `<h${level} id="${hash}">`
        }
      )
      .split(/(<h2 id="示例">[\s\S]+?<\/h2>|<h2 id="属性">[\s\S]+?<\/h2>)/)

      let index = 0
      htmlBlocks[2] = htmlBlocks[2].replace(/<pre><div class="code-index">/g, str => {
        str = theCases[index++] + str
        return str
      })

      obj.html = htmlBlocks.join('')

      return obj

      // console.log(example[2])

      // console.log(Object.keys(fileInfo))

      // console.log(Object.keys(obj))
      // console.log('---- in here ----')

      // obj.html += `
      // <mip-iframe
      //   allowfullscreen
      //   width="320"
      //   height="100"
      //   srcdoc="
      //     <mip-img
      //       layout=\\\"fixed-height\\\"
      //       height=\\\"263\\\"
      //       alt=\\\"baidu mip img\\\"
      //       src=\\\"https://www.mipengine.org/static/img/sample_01.jpg\\\">
      //     </mip-img>
      //   "
      // ></mip-iframe>
      // `

      // return obj

    }, 9998)
  }
}


// `

// 标题|内容
// ----|----
// 类型|通用
// 支持布局| N/S
// 所需脚本|https://c.mipcdn.com/static/v1/mip-audio/mip-audio.js

// ## 示例

// #
// `.match(/^所需脚本\|(.*?)\.js\b/m)
