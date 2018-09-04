/**
 * @file navbar.js
 * @author clark-t (clarktanglei@163.com)
 */

module.exports = [
  {
    "name": "首页",
    "path": "docs/index",
    // "url": "/index.html",
    "activeUrl": /^\/(index\.html|v2|v2\/|v2\/index\.html)?((\?|\#).*)?$/,
    "width": 32
  },
  {
    "name": "学习",
    "width": 32,
    "activeUrl": /^\/(v2\/)?(guide|components|api|codelabs)(.*)((\?|\#).*)?$/,
    "children": [
      {
        "name": "使用文档",
        "path": "docs/guide",
        // "url": "/guide/index.html",
        "width": 64
      },
      {
        "name": "组件列表",
        "path": "docs/extensions",
        // "url": "/components/index.html",
        "width": 64
      },
      {
        "name": "API",
        "path": "docs/api"
        // "url": "/api/index.html"
      },
      {
        "name": "Codelab",
        "path": "docs/codelabs",
        // "url": "/codelabs/index.html",
        "width": 60
      },
      {
        "name": "UI",
        "path": "docs/ui/mip-v-alert.md",
        // "url": "/codelabs/index.html",
        "width": 60
      }
    ]
  },
  // {
  //   "name": "帮助",
  //   "url": "/help",
  //   "width": 32
  // },
  {
    "name": "常用链接",
    "children": [
      {
        "name": "MIP 官方博客",
        "url": "http://www.cnblogs.com/mipengine",
        "blank": true
      },
      {
        "name": "MIP-CLI 本地开发工具",
        "url": "https://github.com/mipengine/mip2/tree/master/packages/mip-cli",
        "blank": true
      },
      {
        "name": "MIP 代码校验工具",
        "url": "https://www.mipengine.org/validator/validate",
        "blank": true
      },
      {
        "name": "MIP 效果预览工具",
        "url": "https://www.mipengine.org/validator/preview",
        "blank": true
      },
      {
        "name": "MIP PATH 转换工具",
        "url": "https://www.mipengine.org/mippath.html",
        "blank": true
      }
    ],
    "width": 82
  },
  {
    "name": "GitHub",
    "url": "https://github.com/mipengine/mip2",
    "blank": true,
    "width": 50
  },
  {
    "name": "回到旧版",
    "url": "https://www.mipengine.org",
    "blank": true,
    // "url": "/index.html",
    "width": 32
  },
]
/* eslint-enable */
