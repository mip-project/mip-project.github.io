/**
 * @file layout.js
 * @author clark-t (clarktanglei@163.com)
 */

const etpl = require('etpl');
const path = require('path');
const fs = require('fs');

const engine = new etpl.Engine({
    commandOpen: '{{',
    commandClose: '}}',
    strip: true
});

module.exports = class Layout {
    apply(on, app) {
        on(app.STAGES.CREATE_DOC_STORE_OBJECT, obj => {
            const renderer = engine.compile(
                fs.readFileSync(path.resolve(__dirname, '../views/layout.tpl'), 'utf-8')
            );

            let html = renderer({
                body: obj.html
            })

            // obj.html = '<html><body>' + obj.html + '</body></html>';
            obj.html = html;
            return obj;
        }, 10100);
    }
};
