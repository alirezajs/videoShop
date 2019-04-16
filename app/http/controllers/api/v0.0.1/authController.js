const controller = require('app/http/controllers/api/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const Comment = require('app/models/comment');
const passport = require('passport');
const jwt = require('jsonwebtoken');

class authController extends controller {

    async login(req, res) {
        if (!await this.validationData(req, res)) return;

        passport.authenticate('local.login', {
            session: false
        }, (err, user) => {
            if (err) return this.failed(err.message, res);
            if (!user) {
                passport.authenticate('local.register')(req, res, next);
            }

            req.login(user, {
                session: false
            }, (err) => {
                if (err) return this.failed(err.message, res);

                //         // create token
                const token = jwt.sign({
                    id: user.id
                }, config.jwt.secret_key, {
                    expiresIn: 60 * 60 * 24
                });

                return res.json({
                    data: {
                        token
                    },
                    status: 'success'
                })

            })

        })(req, res);
    }
    async register(req, res, next) {
        if (!await this.validationData(req, res)) return;
        passport.authenticate('local.register')(req, res, next);

        return res.json({
            status: 'success'
        })
    }




}

module.exports = new authController();