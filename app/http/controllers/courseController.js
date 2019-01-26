const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const Category = require('app/models/category');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

class courseController extends controller {

    async index(req, res) {
        let query = {};
        let { search, type, category } = req.query;

        if (search)
            query.title = new RegExp(search, 'gi');

        if (type && type != 'all')
            query.type = type;

        if (category && category != 'all') {
            category = await Category.findOne({ slug: category });
            if (category)
                query.categories = { $in: [category.id] }
        }

        let courses = Course.find({ ...query });


        if (req.query.order)
            courses.sort({ createdAt: -1 })

        courses = await courses.exec();

        let categories = await Category.find({});
        res.render('home/courses', { courses, categories });
    }
    async payment(req, res, next) {
        try {
            this.isMongoId(req.body.course);

            let course = await Course.findById(req.body.course);
            if (!course) {
                console.log('not found');
                return;
            }

            if (await req.user.checkLearning(course.id)) {
                console.log('شما قبلا در این دوره ثبت نام کرده اید');
                return;
            }

            if (course.price == 0 && (course.type == 'vip' || course.type == 'free')) {
                console.log('این دوره مخصوص اعضای ویژه یا رایگان است و قابل خریداری نیست');
                return;
            }

            // buy proccess

        } catch (err) {
            next(err);
        }
    }
    async single(req, res) {
        let course = await Course.findOneAndUpdate({ slug: req.params.course }, { $inc: { viewCount: 1 } })
            .populate([
                {
                    path: 'user',
                    select: 'name'
                },
                {
                    path: 'episodes',
                    options: { sort: { number: 1 } }
                }
            ])
            .populate([
                {
                    path: 'comments',
                    match: {
                        parent: null,
                        approved: true
                    },
                    populate: [
                        {
                            path: 'user',
                            select: 'name'
                        },
                        {
                            path: 'comments',
                            match: {
                                approved: true
                            },
                            populate: { path: 'user', select: 'name' }
                        }
                    ]
                }
            ]);
        let categories = await Category.find({ parent: null }).populate('childs').exec();


        res.render('home/single-course', { course, categories });
    }

    async download(req, res, next) {
        try {
            this.isMongoId(req.params.episode);

            let episode = await Episode.findById(req.params.episode);
            if (!episode) this.error('چنین فایلی برای این جلسه وجود ندارد', 404);

            if (!this.checkHash(req, episode)) this.error('اعتبار لینک شما به پایان رسیده است', 403);

            let filePath = path.resolve(`./public/download/ASGLKET!1241tgsdq415215/${episode.videoUrl}`);
            if (!fs.existsSync(filePath)) this.error('چنین فایل برای دانلود وجود دارد', 404);

            await episode.inc('downloadCount');

            return res.download(filePath)

        } catch (err) {
            next(err);
        }
    }

  

    checkHash(req, episode) {
        let timestamps = new Date().getTime();
        if (req.query.t < timestamps) return false;

        let text = `aQTR@!#Fa#%!@%SDQGGASDF${episode.id}${req.query.t}`;

        return bcrypt.compareSync(text, req.query.mac);
    }
}

module.exports = new courseController();