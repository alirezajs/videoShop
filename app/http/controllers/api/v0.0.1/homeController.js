const controller = require('app/http/controllers/api/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const Payment = require('app/models/payment');
const passport = require('passport');
const jwt = require('jsonwebtoken');

class homeController extends controller {
    
    async user(req , res) {
        res.json(req.user);
    }

    async history(req , res , next) {
        try {
            let page = req.query.page || 1;
            let payments = await Payment.paginate({ user : req.user.id } , { page , sort : { createdAt : -1} , limit : 20 , populate : 'course'});
        
            res.json({
                data : payments,
                status : 'success'
            })     
        } catch (err) {
            this.failed(err.message , res);
        }
    }
}

module.exports = new homeController();