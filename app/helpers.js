const path = require('path');

module.exports = class Helpers {

    constructor(req, res) {
        this.req = req;
        this.res = res;
    }


    getObjects() {
        return {
            auth: this.auth(),
            viewPath: this.viewPath
        }
    }

    auth() {
        return {
            check: this.req.isAuthenticated(),
            user: this.req.user
        }
    }
    viewPath(dir) {
        return path.resolve(config.layout.view_dir + '/' + dir);
    }

}