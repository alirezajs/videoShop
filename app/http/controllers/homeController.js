const controller = require('app/http/controllers/controller');

const course = require("../../models/course")
class homeController extends controller {

    async index(req, res) {
        let courses = await course.find({}).sort({ createAt: 1 }).limit(8).exec();
        res.render('home/index', { courses });
    }

    async about(req, res) {
        res.render('home/about');
    }
}

module.exports = new homeController();