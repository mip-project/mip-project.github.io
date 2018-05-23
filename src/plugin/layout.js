/**
 * @file layout.js
 * @author clark-t (clarktanglei@163.com)
 */

module.exports = class Layout {
    apply(on, app) {
        on(app.STAGES.CREATE_DOC_STORE_OBJECT, obj => {
            obj.html = '<html><body>' + obj.html + '</body></html>';
            return obj;
        }, 10100);
    }
};
