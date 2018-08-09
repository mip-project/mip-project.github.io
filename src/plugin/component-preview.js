/**
 * @file component-preview.js
 * @author clark-t (clarktanglei@163.com)
 */

const path = require('path')
const fs = require('fs-extra')
// const cheerio = require('cheerio')

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

      let matchScript = fileInfo.file.match(/\s\|?\s*所需脚本\s*\|(.*?)\|?(\r\n|\n\r|\r|\n)/m)

      if (!matchScript) {
        return
      }

      let script = matchScript[1]
        .split(/<br\s*\/?>/)
        .map(url => url.trim())
        .filter(url => /^https?.+?\.js$/.test(url))
        .map(url => `<script src="${url}"></script>`)
        .join('')

      let matchCases = fileInfo.file.match(/\s```\s*html\s([\s\S]+?)\s```\s/g)

      if (!matchCases) {
        return
      }

      let dist = path.resolve(process.cwd())

      let theCases = await Promise.all(
        matchCases.map(async (theCase, i) => {
          theCase = theCase
            .replace(/^\s```\s*html\s/, '')
            .replace(/```\s$/, '')

          let width = 320
          let height = 568

          let html

          if (/<!DOCTYPE html>/.test(theCase)) {
            html = theCase
          } else {
            html = `
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
          }

          let caseUrl = obj.url.replace(/^\//, '').replace(/\.html$/, '') + `-case-${i}.html`
          let pathname = path.resolve(dist, caseUrl)
          await fs.ensureDir(path.dirname(pathname))
          await fs.writeFile(pathname, html, 'utf-8')
          return `<mip-iframe layout="responsive" width="${width}" height="${height}" src="${app.config.host}/${caseUrl}"></mip-iframe>`
        })
      )

      let index = 0
      obj.html = obj.html.replace(/<pre><div class="code-index">((?!<pre>)[\s\S])+?<\/div><code class="lang-html">[\s\S]+?<\/code><\/pre>/g, str => {
        str = `
          <div class="md-fn-wrapper">
            <div class="md-fn-preview-wrapper">
              <div class="md-fn-title">效果预览</div>
              <div class="md-fn-preview-section">
                <mip-showmore maxheight="160" animatetime=".3" id="fn-showmore-${index}">
                  ${theCases[index++]}
                </mip-showmore>
                <div class="md-fn-preview-toggle" dat-closetext="收起" on="tap:fn-showmore-${index - 1}.toggle">展开</div>
              </div>
            </div>
            <div class="md-fn-code-wrapper">
              <div class="md-fn-title md-fn-code-title" on="tap:fn-code-${index - 1}.toggle">查看代码</div>
              <mip-toggle id="fn-code-${index - 1}" layout="nodisplay">
                <div class="md-fn-code-section">
                  ${str}
                </div>
              </mip-toggle>
            </div>
          </div>
        `
        // theCases[index++] + str
        return str
      })

      // obj.html = htmlBlocks.join('')

      return obj
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
