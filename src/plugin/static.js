/**
 * @file static.js
 * @author clark-t (clarktanglei@163.com)
 */

const fs = require('fs-extra');
const path = require('path');

module.exports = class Static {
    apply(on, app) {
        let cachedChangedFileList = [];
        let dist = path.resolve(process.cwd(), 'docs');

        on(app.STAGES.CREATE_DOC_STORE_OBJECT, obj => {
            cachedChangedFileList.push(obj);
        }, 10150);

        on(app.STAGES.DONE, () => {
            cachedChangedFileList.forEach(async obj => {
                let pathname = path.resolve(dist, obj.url.replace(/^\//, '') + '.html');
                await fs.ensureDir(path.dirname(pathname));
                await fs.writeFile(pathname, obj.html, 'utf-8');
            });
            // let urls = cachedChangedFileList.map(obj => obj.url);
            // console.log(urls);
        });
    }
};
