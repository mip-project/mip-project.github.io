/**
 * @file document config
 * @author clark-t (clarktanglei@163.com)
 */

'use strict'

/* eslint-disable fecs-properties-quote */

const path = require('path')
const glob = require('glob')
// const utils = require('./utils/basic')
// const download = require('download-git-repo')
const fs = require('fs-extra')

function aglob (...args) {
  return new Promise((resolve, reject) => {
    glob(...args, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

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
      loader: 'copy',
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
  loader: {
    copy
  },
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
        let [pathname, hash] = filePath.split('#')
        if (/\.md$/.test(pathname)) {
          pathname = urlPrefix + 'components' + pathname.slice(15, -3) + '.html'
          return pathname + (hash != null ? `#${hash}` : '')
        }

        return urlPrefix + 'components' + filePath.slice(15)
      }
    },
    {
      path: /^docs\/guide/,
      url (filePath) {
        let [pathname, hash] = filePath.split('#')
        if (/\.md$/.test(pathname)) {
          pathname = urlPrefix + pathname.slice(5, -3) + '.html'
          return pathname + (hash != null ? `#${hash}` : '')
        }
        return urlPrefix + filePath.slice(5)
      }
    },
    {
      path: /^docs\/api/,
      url (filePath) {
        let [pathname, hash] = filePath.split('#')
        if (/\.md$/.test(pathname)) {
          pathname = urlPrefix + pathname.slice(5, -3) + '.html'
          return pathname + (hash != null ? `#${hash}` : '')
        }
        return urlPrefix + filePath.slice(5)
      }
    },
    {
      path: /^docs\/codelabs\//,
      url (filePath) {
        let [pathname, hash] = filePath.split('#')
        if (/\.md$/.test(pathname)) {
          pathname = urlPrefix + pathname.slice(5, -3) + '.html'
          return pathname + (hash != null ? `#${hash}` : '')
        }
        return urlPrefix + filePath.slice(5)
      }
    },
    {
      path: /^docs\/ui/,
      url (filePath) {
        let [pathname, hash] = filePath.split('#')
        if (/\.md$/.test(pathname)) {
          pathname = urlPrefix + pathname.slice(5, -3) + '.html'
          return pathname + (hash != null ? `#${hash}` : '')
        }
        return urlPrefix + filePath.slice(5)
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
    },
    {
      url: /^\/v2\/ui/,
      menu (url) {
        return 'docs/ui'
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

async function copy ({to}) {
  let main = path.resolve(__dirname, '../../mip2/docs')
  let mip1 = path.resolve(__dirname, '../../mip-extensions/src')
  let mip2 = path.resolve(__dirname, '../../mip2-extensions/components')
  let mip2builtin = path.resolve(to, 'extensions/builtin')
  let mip2ui = path.resolve(__dirname, '../../mip2-ui-components/docs')

  await fs.copy(main, to)

  let distExtensions = path.resolve(to, 'extensions')

  let mip1files = await aglob('**/*.md', {
    root: mip1,
    cwd: mip1
  })

  let mip1infos = mip1files.map(filename => {
    let absolute = path.resolve(mip1, filename)
    let dist
    if (/mip-ad[\/-]/.test(filename)) {
      let basename =  filename.replace(/\/README\.md/, '.md').replace(/mip-ad\//, '')
      dist = path.resolve(distExtensions, 'mip-ad', basename)

    } else {
      let basename =  filename.replace(/\/README\.md/, '.md')
      dist = path.resolve(distExtensions, 'extensions', basename)
    }

    return {absolute, dist}
  })

  let mip2files = await aglob('**/*.md', {
    root: mip2,
    cwd: mip2
  })

  let mip2infos = mip2files.map(filename => {
    let absolute = path.resolve(mip2, filename)
    let dist
    if (/mip-ad[\/-]/.test(filename)) {
      let basename =  filename.replace(/\/README\.md/, '.md').replace(/mip-ad\//, '')
      dist = path.resolve(distExtensions, 'mip-ad', basename)
    } else {
      let basename =  filename.replace(/\/README\.md/, '.md').replace(/(mip-[a-z0-9-]+)\/\1/, '$1')
      dist = path.resolve(distExtensions, 'extensions', basename)
    }

    return {absolute, dist}
  })

  let mip2builtins = await aglob('**/*.md', {
    root: mip2builtin,
    cwd: mip2builtin
  })

  mip2builtins = mip2builtins.map(filename => path.basename(filename))

  // FIXME 随便实现的，如有效率更高的方式请改之
  let mip2length = mip2infos.length

  for (let i = 0; i < mip1infos.length; i++) {
    let j

    for (j = 0; j < mip2length; j++) {
      if (mip1infos[i].dist === mip2infos[j].dist) {
        mip2infos[j].mip1 = mip1infos[i].absolute
        break
      }
    }

    if (j === mip2length) {
      if (mip2builtins.indexOf(path.basename(mip1infos[i].dist)) === -1) {
        mip2infos.push(mip1infos[i])
      }
    }
  }

  mip2infos.sort((a, b) => a.dist.localeCompare(b.dist))

  mip2infos.map(({absolute, dist, mip1}) => {
    fs.copySync(absolute, dist)

    let settingDir = path.resolve(absolute, '..', 'setting')

    if (!fs.existsSync(settingDir)) {
      // mip2 组件的文档没有 preset 所以先暂时拿 mip1 的代替
      if (!mip1) {
        return
      }

      settingDir = path.resolve(mip1, '..', 'setting')

      if (!fs.existsSync(settingDir)) {
        return
      }
    }

    let distSettingDir = path.resolve(dist, '..', 'setting')
    let componentSettingDir = path.resolve(distSettingDir, path.basename(dist, path.extname(dist)))

    fs.ensureDirSync(distSettingDir)
    fs.removeSync(componentSettingDir)
    fs.copySync(settingDir, componentSettingDir)
  })

  let extensionsMeta = await fs.readFile(path.resolve(distExtensions, 'extensions/meta.json'))
  extensionsMeta = JSON.parse(extensionsMeta)
  let extensionsMenu = extensionsMeta.menu.filter(m => m.preview != null)
  let finalExtensions = mip2infos.filter(info => !/mip-ad[\/-]/.test(info.dist))
  let finalExtensionsMenu = finalExtensions.map(info => {
    let key = path.basename(info.dist, path.extname(info.dist))
    let obj = {key}
    for (let i = 0; i < extensionsMenu.length; i++) {
      if (key === extensionsMenu[i].key) {
        obj.preview = extensionsMenu[i].preview
      }
    }
    return obj
  })

  extensionsMeta.menu = finalExtensionsMenu
  await fs.writeFile(path.resolve(distExtensions, 'extensions/meta.json'), JSON.stringify(extensionsMeta), 'utf-8')

  let mip2uiFiles = await aglob('**/*.md', {
    root: mip2ui,
    cwd: mip2ui
  })

  mip2uiFiles.map(filename => {
    let absolute = path.resolve(mip2ui, filename)
    let distname = filename.replace(/\/README\.md$/, '.md')
    let distpath = path.resolve(to, 'ui', distname)

    fs.copySync(absolute, distpath)
    let settingDir = path.resolve(absolute, '..', 'setting')

    if (!fs.existsSync(settingDir)) {
      return
    }

    let distSettingDir = path.resolve(distpath, '..', 'setting')
    let componentSettingDir = path.resolve(distSettingDir, path.basename(distpath, path.extname(distpath)))
    fs.ensureDirSync(distSettingDir)
    fs.removeSync(componentSettingDir)
    fs.copySync(settingDir, componentSettingDir)
  })
}

// fs.removeSync(path.resolve(docDir, 'docs'))
// copy({to: path.resolve(docDir, 'docs')})

