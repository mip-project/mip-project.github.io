/**
 * @file component-preview.js
 * @author clark-t (clarktanglei@163.com)
 */

const path = require('path')
const fs = require('fs-extra')
// const cheerio = require('cheerio')

const caseHtml = ({url, style, preset, cases, scripts}) => '' +
`<!DOCTYPE html>
<html mip>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
  <title>测试</title>
  <meta name="description" content="">
  <link rel="canonical" href="/${url}">
  <link rel="stylesheet" type="text/css" href="https://bos.nj.bpc.baidu.com/v1/assets/mip/projects/mip.css">
  ${style}
</head>
<body>
  ${preset}
  ${cases}
  <script type="data-x-preset" id="preset">
  ${preset.replace(/</g, '___arrow_left___').replace(/>/g, '___arrow_right___')}
  </script>
  <script src="https://bos.nj.bpc.baidu.com/v1/assets/mip/projects/mip.js"></script>
  ${scripts}
  <script>
  var preset;
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'demo-edit') {
      return;
    }

    if (!preset) {
      preset = document.getElementById('preset').innerHTML
        .replace(/___arrow_left___/g, '<')
        .replace(/___arrow_right___/g, '>');
    }
    document.body.innerHTML = preset + e.data.html;
  })
  </script>
</body>
</html>`

const editHtml = ({cases, url, docUrl}) => '' +
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
    <title>测试</title>
    <meta name="description" content="">
    <link rel="stylesheet" type="text/css" href="https://cdn.bootcss.com/codemirror/5.38.0/codemirror.min.css">
    <style>
      html, body {
        margin: 0;
      }
      .edit-toolbar {
        height: 60px;
        padding-left: 20px;
        line-height: 60px;
      }
      #submit {
        height: 40px;
        padding-left: 15px;
        padding-right: 15px;
      }
      .edit-wrapper {
        display: flex;
        padding: 6px 20px 20px;
        background: #eee;
      }
      .edit-code {
        flex: 1;
        overflow: auto;
      }
      .edit-iframe-wrapper {
        width: 320px;
        margin-left: 20px;
      }
      #edit-iframe {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        background: #fff;
      }
      .CodeMirror {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        height: 568px;
      }
      .toolbar-button {
        margin-right: 20px;
        height: 40px;
        box-sizing: border-box;
        padding: 0 15px;
        display: inline-block;
        line-height: 40px;
        border: 1px solid #000;
        text-decoration: none;
        color: #000;
        cursor: pointer;
      }
      .toolbar-button:active {
        background: #eee;
      }
    </style>
  </head>
  <body>
    <div class="edit-toolbar">
      <a class="toolbar-button" href="${docUrl}">返回文档</a>
    </div>
    <div class="edit-wrapper">
      <div class="edit-code">
        <p class="edit-tip">编辑您的代码：</p>
        <textarea id="code" name="code">${cases}</textarea>
      </div>
      <div class="edit-iframe-wrapper">
        <p class="edit-tip">查看结果：</p>
        <iframe id="edit-iframe" frameborder="0" width="320" height="568" src="/${url}"></iframe>
      </div>
    </div>
    <script src="https://cdn.bootcss.com/codemirror/5.38.0/codemirror.min.js"></script>
    <script src="https://cdn.bootcss.com/codemirror/5.38.0/mode/javascript/javascript.min.js"></script>
    <script src="https://cdn.bootcss.com/codemirror/5.38.0/mode/xml/xml.min.js"></script>
    <script src="https://cdn.bootcss.com/codemirror/5.38.0/mode/css/css.min.js"></script>
    <script src="https://cdn.bootcss.com/codemirror/5.38.0/mode/htmlmixed/htmlmixed.min.js"></script>
    <script src="https://cdn.bootcss.com/codemirror/5.38.0/addon/selection/active-line.min.js"></script>
    <script src="https://cdn.bootcss.com/codemirror/5.38.0/addon/edit/matchbrackets.min.js"></script>
    <script>
       var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        mode: 'htmlmixed',
        identUnit: 2
      });
      editor.setOption("theme", 'default');
      var iframe = document.getElementById('edit-iframe');

      var timer;
      function throttle (fn) {
        if (timer != null) {
          clearTimeout(timer);
        }
        timer = setTimeout(function () {
          timer = null;
          fn();
        }, 500);
      }

      editor.on('change', function () {
        throttle(function () {
          let val = editor.getValue();
          try {
            iframe.contentWindow.postMessage({type: 'demo-edit', html: val}, '*');
          } catch (e) {
            console.error('post fail');
          }
        });
      });
    </script>
  </body>
</html>

`

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
              html = caseHtml({
                url: caseUrl,
                style: uiStyle,
                preset: preset,
                cases: cases,
                scripts: scripts
              })

              edit = editHtml({
                url: caseUrl,
                cases: cases,
                docUrl: obj.url
              })
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
          let editButton = editUrl ? `<a class="md-fn-link" href="${editUrl}" target="_blank">编辑示例</a>` : ''

          str = `
            <div class="md-fn-wrapper">
              <div class="md-fn-preview-wrapper">
                <div class="md-fn-title md-fn-title-right">
                  <a href="${caseUrl}" class="md-fn-link" target="_blank">查看例子</a>
                  ${editButton}
                </div>
                <div class="md-fn-preview-section">
                  <mip-showmore maxheight="160" animatetime=".3" id="fn-showmore-${i}">
                    ${cases}
                  </mip-showmore>
                  <div class="md-fn-preview-toggle" dat-closetext="收起" on="tap:fn-showmore-${i}.toggle">展开</div>
                </div>
              </div>
              <div class="md-fn-code-wrapper">
                <div class="md-fn-title md-fn-code-title" on="tap:fn-code-${i}.toggle">查看代码</div>
                <mip-toggle id="fn-code-${i}" layout="nodisplay">
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
