const controller = require('app/http/controllers/controller');
const course = require("../../models/course");
const Comment = require("../../models/comment");

class homeController extends controller {

    async index(req, res) {
        let courses = await course.find({lang:req.getLocale()}).sort({ createAt: 1 }).limit(8).exec();
        res.render('home/index', { courses });
    }

    async about(req, res) {
        res.render('home/about');
    }
    async comment(req, res, next) {
        try {

            let status = await this.validationData(req);
            if (!status) return this.back(req, res);


            let newComment = new Comment({
                user: req.user.id,
                ...req.body
            })


            await newComment.save();

            return this.back(req, res);




        }
        catch (err) {
            next(err)
        }

    }
}

module.exports = new homeController();