/**
 * @file component-preview.js
 * @author clark-t (clarktanglei@163.com)
 */

const path = require('path')
const fs = require('fs-extra')
// const cheerio = require('cheerio')

module.exports = class ComponentPreview {
  apply (on, app) {
    on(app.STAGES.DONE, async () => {
      let docPaths = await app.store.get('data', 'docurls')
      await Promise.all(Object.keys(docPaths).map(async docPath => {
        let obj = await app.store.get('doc', docPath)

        // 只针对 components 下的符合 文档格式的组件做预览效果
        if (!/^docs\/extensions\//.test(obj.path) && !/^docs\/ui\//.test(obj.path)) {
          return
        }

        if (obj.info && obj.info.preview === false) {
          return
        }

        let fileInfo = await app.getFileInfo(obj.path)

        if (!fileInfo || !fileInfo.file) {
          return
        }

        let matchScript = fileInfo.file.match(/\s\|?\s*所需脚本\s*\|(.*?)\|?(\r\n|\n\r|\r|\n)/m)

        let uiStyle = ''

        // mip2 ui components need: vuetify.js & vuetify.css in iframe
        if (/^docs\/ui/.test(obj.path)) {
          matchScript = [undefined, 'https://bos.nj.bpc.baidu.com/v1/assets/mip/projects/vuetify.min.js']
          uiStyle = '<link rel="stylesheet" type="text/css" href="https://bos.nj.bpc.baidu.com/v1/assets/mip/projects/vuetify.min.css">'
        }

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

        let fileFullPath = fileInfo.fullPath
        let fileBaseName = path.basename(fileFullPath)
        let fileExtName = path.extname(fileFullPath)
        let fileDirName = path.dirname(fileFullPath)
        let fileName = path.basename(fileBaseName, fileExtName)
        let demoPreset = path.resolve(fileDirName, 'setting', fileName, 'example.preset')

        let demoPresetContent
        if (await fs.exists(demoPreset)) {
          let file = await fs.readFile(demoPreset, 'utf-8')
          demoPresetContent = file
          // demoPresetContent = demoPresetContent.replace(/<[\s\S]+>/g, '')
        } else {
          demoPresetContent = ''
        }

        let theCases = await Promise.all(
          matchCases.map(async (theCase, i) => {
            theCase = theCase
              .replace(/^\s```\s*html\s/, '')
              .replace(/```\s$/, '')

            let width = 320
            let height = 568

            let caseUrl = obj.url.replace(/^\//, '').replace(/\.html$/, '') + `-case-${i}.html`

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
                  <link rel="canonical" href="${caseUrl}">
                  <link rel="stylesheet" type="text/css" href="https://bos.nj.bpc.baidu.com/v1/assets/mip/projects/mip.css">
                  ${uiStyle}
                </head>
                <body>
                  ${demoPresetContent}
                  ${theCase}
                  <script src="https://bos.nj.bpc.baidu.com/v1/assets/mip/projects/mip.js"></script>
                  ${script}
                </body>
              `
            }

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
                <!-- <div class="md-fn-title">效果预览</div> -->
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

        await app.store.set('doc', docPath, obj)
      }))

      // obj.html = htmlBlocks.join('')

      // return obj
    }, 10100)
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
