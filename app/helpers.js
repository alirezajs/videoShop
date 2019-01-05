module.exports = class Helpers {
    
    constructor(req , res) {
        this.req = req;
        this.res = res;
    }


    getObjects() {
        return {
            auth : this.auth()
        }
    }

    auth() {
        return {
            check : this.req.isAuthenticated(),
            user : this.req.user
        }
    }

}