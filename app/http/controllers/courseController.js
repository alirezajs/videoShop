const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
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

    async download(req, res, next) {
        try {
            this.isMongoId(req.params.episode);
            let episode = await Episode.findById(req.params.episode);
            if (!episode) this.error("چنین فایلی وجود ندارد", 404);

            if (!this.checkHash(req, res, episode)) this.error('اعتبار لینک شما به پایان رسیده است', 404)

            let filePath = path.resolve(`./public/videos/${episode.videoUrl}`)

            if (!fs.existsSync(filePath)) this.error('چنین فایلی برای دانلود وجود ندارد', 404);


            res.download(filePath);
        }
        catch (err) {
            next(err);
        }

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

    checkHash(req, res, episode) {

        let timestamps = new Date().getTime();
        if (req.query.t < timestamps) return false;
        let text = `aQTRQ!#fa38r47sjkhdjfsf${episode.id}${req.query.t}`;
        return bcrypt.compareSync(text, req.query.mac);
    }
}

module.exports = new courseController();