/**
 * @file document config
 * @author clark-t (clarktanglei@163.com)
 */

'use strict';

/* eslint-disable fecs-properties-quote */

const path = require('path');
const utils = require('./utils/basic');

let rootDir = path.resolve(__dirname, '..');
let tmpDir = path.resolve(rootDir, 'tmp');
let docDir = path.resolve(tmpDir, 'doc');
let gitDir = path.resolve(tmpDir, 'git');

module.exports = {
    host: 'https://mip-project.github.io',
    basePath: docDir,
    sources: [
        {
            name: 'lavas',
            // loader: 'local',
            // from: path.resolve(__dirname, '../../test/lavas'),

            loader: 'downloadGitRepo',
            from: 'github:lavas-project/lavas-tutorial',
            to: path.resolve(docDir, './lavas'),
            tmp: path.resolve(gitDir, './lavas')
        }
    ],
    routes: [
        {
            path(filePath) {
                return /\.[a-zA-Z0-9]+($|\?|#)/.test(filePath) && !/\.md($|\?|#)/.test(filePath);
            },
            url(filePath) {
                return `/doc-assets/${filePath}`;
            }
        },
        {
            path: /^lavas\/vue/,
            url(filePath) {
                filePath = filePath.replace(/\.md($|\?|#)/, '$1').replace(/^lavas\/vue/, 'v1');
                return `/guide/${filePath}`;
            }
        },
        {
            path: /^lavas\//,
            url(filePath) {
                filePath = filePath.replace(/\.md($|\?|#)/, '$1').replace(/^lavas\//, '');
                return `/guide/${filePath}`;
            }
        }
    ],
    menus: [
        {
            url: /^\/guide\/v1/,
            menu(url) {
                return 'lavas/vue';
            }
        },
        {
            url: /^\/guide\//,
            menu(url) {
                let match = url.match(/^\/guide\/(.+?)(\/|$)/);
                if (match) {
                    return `lavas/${match[1]}`;
                }
            }
        }
    ],
    alias: [
        {
            url: /^\/guide$/,
            async alias(url, compiler) {
                let menu = await compiler.getMenu('lavas');

                if (!menu) {
                    return;
                }

                menu = menu.filter(item => !!item.children);
                let node = utils.firstNode(menu);
                return node && node.url;
            }
        }
    ]
};
