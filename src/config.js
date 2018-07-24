/**
 * @file document config
 * @author clark-t (clarktanglei@163.com)
 */

'use strict';

/* eslint-disable fecs-properties-quote */

const path = require('path');
const utils = require('./utils/basic');
const download = require('download-git-repo');
const fs = require('fs-extra');

let rootDir = path.resolve(__dirname, '..');
let tmpDir = path.resolve(rootDir, 'tmp');
let docDir = path.resolve(tmpDir, 'doc');
let gitDir = path.resolve(tmpDir, 'git');

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
        name: 'guide',
        loader: 'local',
        from: path.resolve(__dirname, '../../mip2/docs/guide'),
        to: path.resolve(docDir, 'guide')
        // ,
        // ignores: [
        //   path.resolve(__dirname, '../../mip2/docs/new-doc/components')
        // ]
      },
      {
        name: 'components',
        loader: 'local',
        from: path.resolve(__dirname, '../../mip2/docs/extensions'),
        to: path.resolve(docDir, 'components')
      }
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
            let dist = path.resolve(rootDir, 'img/' + filePath)
            fs.ensureDirSync(path.dirname(dist))
            fs.copySync(path.resolve(docDir, filePath), dist)
          } catch (e) {
            console.error(e)
          }
          filePath = '/img/' + filePath
          return filePath
        }
      },
      {
        path: /^components/,
        url (filePath) {
          filePath = '/' + filePath.replace(/\.md($|\?|#)/, '$1') + '.html'
          return filePath;
        }
      },
      {
        path: /^guide/,
        url (filePath) {
          filePath = '/' + filePath.replace(/\.md($|\?|#)/, '$1') + '.html'
          return filePath
        }
      }
        // {
        //     path(filePath) {
        //         return /\.[a-zA-Z0-9]+($|\?|#)/.test(filePath) && !/\.md($|\?|#)/.test(filePath);
        //     },
        //     url(filePath) {
        //         return `/doc-assets/${filePath}`;
        //     }
        // },
        // {
        //     path: /^lavas\/vue/,
        //     url(filePath) {
        //         filePath = filePath.replace(/\.md($|\?|#)/, '$1').replace(/^lavas\/vue/, 'v1');
        //         return `/guide/${filePath}`;
        //     }
        // },
        // {
        //     path: /^lavas\//,
        //     url(filePath) {
        //         filePath = filePath.replace(/\.md($|\?|#)/, '$1').replace(/^lavas\//, '');
        //         return `/guide/${filePath}`;
        //     }
        // }
    ],
    menus: [
      {
        url: /^\/components/,
        menu (url) {
          return 'components'
        }
      },
      {
        url: /^\/guide/,
        menu (url) {
          return 'guide'
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
};
