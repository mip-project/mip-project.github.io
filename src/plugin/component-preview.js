/**
 * @file component-preview.js
 * @author clark-t (clarktanglei@163.com)
 */

const path = require('path')
const fs = require('fs-extra')
const renderer = require('../utils/renderer')
let navbarFactory = require('../data/navbar')
// const cheerio = require('cheerio')

// const isDev = process.env.NODE_ENV === 'development'

let css

try {
  css = fs.readFileSync(path.resolve(__dirname, '../style/dist/preview-edit.css'))
} catch (e) {
  css = ''
}


module.exports = class ComponentPreview {
  apply (on, app) {
    on(app.STAGES.DONE, async () => {
      let navbar = navbarFactory()
      await processNavbar(navbar, app)

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
          uiStyle =`
            <link rel="stylesheet" type="text/css" href="https://bos.nj.bpc.baidu.com/v1/assets/mip/projects/vuetify.min.css">
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css">
          `
        }

        if (!matchScript) {
          return
        }

        let scripts = matchScript[1]
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
        let presetPath = path.resolve(fileDirName, 'setting', fileName, 'example.preset')

        let preset = ''
        if (await fs.exists(presetPath)) {
          let file = await fs.readFile(presetPath, 'utf-8')
          preset = file
          // demoPresetContent = demoPresetContent.replace(/<[\s\S]+>/g, '')
        }

        let theCases = await Promise.all(
          matchCases.map(async (cases, i) => {
            cases = cases
              .replace(/^\s```\s*html\s/, '')
              .replace(/```\s$/, '')

            let width = 320
            let height = 568

            let caseUrl = obj.url.replace(/^\//, '').replace(/\.html$/, '') + `-case-${i}.html`
            let editUrl = obj.url.replace(/^\//, '').replace(/\.html$/, '') + `-edit-${i}.html`

            let html
            let edit

            if (/<!DOCTYPE html>/.test(cases)) {
              html = cases
            } else {
              html = renderer.render('preview-case', {
                development: process.env.NODE_ENV === 'development',
                // css: css,
                url: caseUrl,
                style: uiStyle,
                preset: preset,
                cases: cases,
                scripts: scripts
              })

              edit = renderer.render('preview-edit', {
                development: process.env.NODE_ENV === 'development',
                css: css,
                url: caseUrl,
                cases: cases,
                docUrl: obj.url,
                navbar,
                navIndex: 1
              })
              // html = caseHtml({
              //   url: caseUrl,
              //   style: uiStyle,
              //   preset: preset,
              //   cases: cases,
              //   scripts: scripts
              // })

              // edit = editHtml({
              //   url: caseUrl,
              //   cases: cases,
              //   docUrl: obj.url
              // })
            }

            let pathname = path.resolve(dist, caseUrl)
            await fs.ensureDir(path.dirname(pathname))
            await fs.writeFile(pathname, html, 'utf-8')

            if (edit) {
              let pathname = path.resolve(dist, editUrl)
              await fs.ensureDir(path.dirname(pathname))
              await fs.writeFile(pathname, edit, 'utf-8')
            }

            return [
              `<mip-iframe layout="responsive" width="${width}" height="${height}" src="${app.config.host}/${caseUrl}"></mip-iframe>`,
              `${app.config.host}/${caseUrl}`,
              edit && `${app.config.host}/${editUrl}`
            ]
          })
        )

        let index = 0

        obj.html = obj.html.replace(/<pre><div class="code-index">((?!<pre>)[\s\S])+?<\/div><code class="lang-html">[\s\S]+?<\/code><\/pre>/g, str => {
          let i = index
          index++

          let cases = theCases[i][0]
          let caseUrl = theCases[i][1]
          let editUrl = theCases[i][2]

          str = renderer.render('preview-component', {
             cases,
             caseUrl,
             editUrl,
             codes: str
          })

          // let editButton = editUrl ? `<a class="md-component-link md-component-link-edit" href="${editUrl}" target="_blank">编辑示例</a>` : ''

          // str = `
          //   <div class="md-component-preview-wrapper">
          //     <div class="md-component-preview">${cases}</div>
          //     <div class="md-component-code-wrapper">
          //       <div class="md-component-toolbar">
          //         <a href="${caseUrl}" class="md-component-link" target="_blank">查看例子</a>
          //         ${editButton}
          //       </div>
          //       <div class="md-component-code-box">${str}</div>
          //     </div>
          //   </div>
          // `

          // str = `
          //   <div class="md-fn-wrapper">
          //     <div class="md-fn-preview-wrapper">
          //       <div class="md-fn-title md-fn-title-right">
          //         <a href="${caseUrl}" class="md-fn-link" target="_blank">查看例子</a>
          //         ${editButton}
          //       </div>
          //       <div class="md-fn-preview-section">
          //         <mip-showmore maxheight="160" animatetime=".3" id="fn-showmore-${i}">
          //           ${cases}
          //         </mip-showmore>
          //         <div class="md-fn-preview-toggle" dat-closetext="收起" on="tap:fn-showmore-${i}.toggle">展开</div>
          //       </div>
          //     </div>
          //     <mip-accordion class="md-fn-code-wrapper" sessions-key="fn-code-${i}">
          //       <section>
          //         <div class="md-fn-title md-fn-code-title">查看代码</div>
          //         <div class="md-fn-code-section">
          //           ${str}
          //         </div>
          //       </section>
          //     </mip-accordion>
          //   </div>
          // `
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

async function processNavbar (navbar, app) {
  for (let i = 0; i < navbar.length; i++) {
    if (navbar[i].path) {
      navbar[i].url = await app.getUrl(navbar[i].path)
    }

    if (navbar[i].children && navbar[i].children.length) {
      await processNavbar(navbar[i].children, app)
    }
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
