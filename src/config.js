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
    host: 'https://mip-project.github.io',
    basePath: docDir,
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
        name: 'mip',
        loader: 'local',
        from: path.resolve(__dirname, '../../mip2/docs/new-doc'),
        to: path.resolve(docDir, 'mip')
      }
    ],
    routes: [
        {
            path: /^mip/,
            url(filePath) {
                filePath = '/' + filePath.replace(/\.md($|\?|#)/, '$1') + '.html';
                return filePath;
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
            url: /^\/mip/,
            menu(url) {
                return 'mip';
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
