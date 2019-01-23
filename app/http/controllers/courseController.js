const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');

class courseController extends controller {

    async index(req, res) {


        res.render('home/courses');
    }

    async single(req, res) {

        let course = await Course.findOne({ slug: req.params.course })
            .populate([
                {
                    path: 'user',
                    select: 'name'
                },
                {
                    path: 'episodes',
                    options: {
                        sort: { number: 1 }
                    }
                }
            ]);
        let canUserUse = await this.canUse(req, course);
        res.render('home/single-course', { course, canUserUse });

    }
    async canUse(req, course) {
        let canUse = false;
        if (req.isAuthenticated()) {
            switch (course.type) {
                case 'vip':
                    canUse = req.user.isVip()
                    break;
                case 'cash':
                    canUse = req.user.checkLearning(course);
                    break;
                default:
                    canUse = true;
                    break;
            }
        }
        return canUse;
    }
}

module.exports = new courseController();