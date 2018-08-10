/**
 * @file document config
 * @author clark-t (clarktanglei@163.com)
 */

'use strict'

/* eslint-disable fecs-properties-quote */

const path = require('path')
// const utils = require('./utils/basic')
// const download = require('download-git-repo')
const fs = require('fs-extra')

let rootDir = path.resolve(__dirname, '..')
let tmpDir = path.resolve(rootDir, 'tmp')
let docDir = path.resolve(tmpDir, 'doc')
// let gitDir = path.resolve(tmpDir, 'git')

const urlPrefix = '/v2/'

module.exports = {
  host: process.env.NODE_ENV === 'development' ? '' : 'https://mip-project.github.io',
  basePath: docDir,
  rootPath: rootDir,
  // sources: [
  //     {
  //         name: 'mip',
  //         loader: 'downloadMipDoc',
  //         from: 'github:mipengine/mip2',
  //         to: path.resolve(docDir, './mip'),
  //         tmp: path.resolve(gitDir, './mip')
  //     }
  // ],
  // loader: {
  //     downloadMipDoc: function ({from, to, tmp}) {
  //         let tmpDir = tmp || to;

  //         let promise = new Promise((resolve, reject) => {
  //             download(from, tmpDir, {clone: false}, err => {
  //                 fs.move(path.resolve(tmpDir, './docs'), path.resolve(tmpDir, '../mip-doc'))
  //                     .then(function () {
  //                         if (err) {
  //                             reject(err);
  //                         }
  //                         else if (tmp) {
  //                             fs.move(path.resolve(tmpDir, '../mip-doc'), to, {overwrite: true}).then(resolve);
  //                         }
  //                         else {
  //                             resolve();
  //                         }
  //                     });
  //             });
  //         });
  //         return promise;
  //     }
  // },
  sources: [
    {
      name: 'docs',
      loader: 'local',
      from: path.resolve(__dirname, '../../mip2/docs'),
      to: path.resolve(docDir, 'docs')
      // ,
      // ignores: [
      //   path.resolve(__dirname, '../../mip2/docs/new-doc/components')
      // ]
    }
    // ,
    // {
    //   name: 'components',
    //   loader: 'local',
    //   from: path.resolve(__dirname, '../../mip2/docs/extensions'),
    //   to: path.resolve(docDir, 'components')
    // }
  ],
  // loader: {
  //   copy: async function ({from, to, ignores}) {
  //     if (!await fs.exists(from)) {
  //       throw new Error(from + '文件夹不存在')
  //     }

  //     let stat = await fs.stat(from)

  //     if (!stat.isDirectory()) {
  //       throw new Error(from + '不是文件夹')
  //     }

  //     await fs.remove(to)
  //     await fs.copy(from, to)

  //     if (ignores && ignores.length) {
  //       await Promise.all(ignores.map(async ignore => {
  //         let newPath = path.resolve(to, path.relative(from, ignore))
  //         await fs.remove(newPath)
  //       }))
  //     }
  //   }
  // },
  routes: [
    {
      path: /\.(png|jpg|gif)$/,
      url (filePath) {
        try {
          let dist = path.resolve(rootDir, 'assets/img/' + filePath)
          fs.ensureDirSync(path.dirname(dist))
          fs.copySync(path.resolve(docDir, filePath), dist)
        } catch (e) {
          console.error(e)
        }
        filePath = '/assets/img/' + filePath
        return filePath
      }
    },
    {
      path: /^docs\/index$/,
      url (filePath) {
        return urlPrefix + 'index.html'
      }
    },
    {
      path: /^docs\/codelabs$/,
      url (filePath) {
        return urlPrefix + 'codelabs/index.html'
      }
    },
    {
      path: /^docs\/api$/,
      url (filePath) {
        return urlPrefix + 'api/index.html'
      }
    },
    {
      path: /^docs\/extensions$/,
      url (filePath) {
        return urlPrefix + 'components/index.html'
      }
    },
    {
      path: /^docs\/codelabs$/,
      url (filePath) {
        return urlPrefix + 'codelabs/index.html'
      }
    },
    {
      path: /^docs\/guide$/,
      url (filePath) {
        return urlPrefix + 'guide/basic/newbie.html'
      }
    },
    {
      path: /^docs\/extensions/,
      url (filePath) {
        if (/\.md$/.test(filePath)) {
          filePath = urlPrefix + 'components' + filePath.slice(15).replace(/\.md($|\?|#)/, '$1') + '.html'
          return filePath
        }

        return urlPrefix + 'components' + filePath.slice(15) + '/index.html'
      }
    },
    {
      path: /^docs\/guide/,
      url (filePath) {
        if (/\.md$/.test(filePath)) {
          filePath = urlPrefix + filePath.slice(5).replace(/\.md($|\?|#)/, '$1') + '.html'
          return filePath
        }
        return urlPrefix + filePath.slice(5) + '/index.html'
      }
    },
    {
      path: /^docs\/api/,
      url (filePath) {
        if (/\.md$/.test(filePath)) {
          filePath = urlPrefix + filePath.slice(5).replace(/\.md($|\?|#)/, '$1') + '.html'
          return filePath
        }
        return urlPrefix + filePath.slice(5) + '/index.html'
      }
    },
    {
      path: /^docs\/codelabs\//,
      url (filePath) {
        filePath = urlPrefix + filePath.slice(5).replace(/\.md($|\?|#)/, '$1') + '.html'
        return filePath
      }
    }
  ],
  menus: [
    {
      url: /^\/v2\/components/,
      menu (url) {
        return 'docs/extensions'
      }
    },
    {
      url: /^\/v2\/guide/,
      menu (url) {
        return 'docs/guide'
      }
    },
    {
      url: /^\/v2\/api/,
      menu (url) {
        return 'docs/api'
      }
    },
    {
      url: /^\/v2\/codelabs/,
      menu (url) {
        let match = url.match(/^\/v2\/codelabs\/(.+?)(\/|$)/)
        if (match) {
          return `docs/codelabs/${match[1]}`
        }
        // return 'docs/codelabs'
      }
    }
  ]
  // menus: [
  //     {
  //         url: /^\/guide\/v1/,
  //         menu(url) {
  //             return 'lavas/vue';
  //         }
  //     },
  //     {
  //         url: /^\/guide\//,
  //         menu(url) {
  //             let match = url.match(/^\/guide\/(.+?)(\/|$)/);
  //             if (match) {
  //                 return `lavas/${match[1]}`;
  //             }
  //         }
  //     }
  // ],
  // alias: [
  //     {
  //         url: /^\/guide$/,
  //         async alias(url, compiler) {
  //             let menu = await compiler.getMenu('lavas');

  //             if (!menu) {
  //                 return;
  //             }

  //             menu = menu.filter(item => !!item.children);
  //             let node = utils.firstNode(menu);
  //             return node && node.url;
  //         }
  //     }
  // ]
}
