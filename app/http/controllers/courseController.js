const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const Category = require('app/models/category');
const Payment = require('app/models/payment');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const request = require('request-promise');

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
            courses.sort({ createdAt: 1 })
        else
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
                return this.alertAndBack(req, res, {
                    title: 'دقت کنید',
                    message: 'چنین دوره ای یافت نشد',
                    type: 'error'
                });
            }

            if (await req.user.checkLearning(course.id)) {
                return this.alertAndBack(req, res, {
                    title: 'دقت کنید',
                    message: 'شما قبلا در این دوره ثبت نام کرده اید',
                    type: 'error',
                    button: 'خیلی خوب'
                });
            }

            if (course.price == 0 && (course.type == 'vip' || course.type == 'free')) {
                return this.alertAndBack(req, res, {
                    title: 'دقت کنید',
                    message: 'این دوره مخصوص اعضای ویژه یا رایگان است و قابل خریداری نیست',
                    type: 'error',
                    button: 'خیلی خوب'
                });
            }

            // buy proccess
            // return this.alertAndBack(req, res, {
            //     title: 'دقت کنید',
            //     message: 'هنوز بخش خرید درست نشده',
            //     type: 'error',
            //     button: 'خیلی خوب'
            // });


            let params = {
                MerchantID: 'f83cc956-f59f-11e6-889a-005056a205be',
                Amount: course.price,
                CallbackURL: 'http://localhost:3000/courses/payment/checker',
                Description: `بابت خرید دوره ${course.title}`,
                Email: req.user.email
            };

            let options = this.getUrlOption(
                'https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json',
                params
            );

            request(options)
                .then(async data => {
                    let payment = new Payment({
                        user: req.user.id,
                        course: course.id,
                        resnumber: data.Authority,
                        price: course.price
                    });

                    await payment.save();

                    res.redirect(`https://www.zarinpal.com/pg/StartPay/${data.Authority}`)
                })
                .catch(err => res.json(err.message));

        } catch (err) {
            next(err);
        }
    }

    async checker(req, res, next) {
        try {
            if (req.query.Status && req.query.Status !== 'OK')
                return this.alertAndBack(req, res, {
                    title: 'دقت کنید',
                    message: 'پرداخت شما با موفقیت انجام نشد',
                });

            let payment = await Payment.findOne({ resnumber: req.query.Authority }).populate('course').exec();

            if (!payment.course)
                return this.alertAndBack(req, res, {
                    title: 'دقت کنید',
                    message: 'دوره ای که شما پرداخت کرده اید وجود ندارد',
                    type: 'error'
                });

            let params = {
                MerchantID: 'f3cc956-f59f-11e6-889a-005056a205be',
                Amount: payment.course.price,
                Authority: req.query.Authority
            }

            let options = this.getUrlOption('https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json', params)

            request(options)
                .then(async data => {
                    if (data.Status == 100) {
                        payment.set({ payment: true });
                        req.user.learning.push(payment.course.id);

                        await payment.save();
                        await req.user.save();

                        this.alert(req, {
                            title: 'با تشکر',
                            message: 'عملیات مورد نظر با موفقیت انجام شد',
                            type: 'success',
                            button: 'بسیار خوب'
                        })

                        res.redirect(payment.course.path());
                    } else {
                        this.alertAndBack(req, res, {
                            title: 'دقت کنید',
                            message: 'پرداخت شما با موفقیت انجام نشد',
                        });
                    }
                }).catch(err => {
                    next(err);
                })
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
            ])
            .populate(["teacher"])

        let categories = await Category.find({ parent: null }).populate('childs').exec();

        let courses = await Course.find({ lang: req.getLocale() }).sort({ createdAt: -1 }).limit(3).exec();
        let episode = {};
        console.log(course)
        res.render('home/single-course', { course, categories, courses, episode });
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

    async episode(req, res, next) {
        try {
            this.isMongoId(req.params.episode);

            let episode = await Episode.findById(req.params.episode);
            if (!episode) this.error('چنین فایلی برای این جلسه وجود ندارد', 404);


            let url = await episode.download(req.isAuthenticated(), req.user);

            if (url != "#")
                episode.url = config.siteurl + url;


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

            let courses = await Course.find({ lang: req.getLocale() }).sort({ createdAt: -1 }).limit(3).exec();

            res.render('home/single-course', { course, categories, courses, episode });

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

    getUrlOption(url, params) {
        return {
            method: 'POST',
            uri: url,
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            body: params,
            json: true
        }
    }
}

module.exports = new courseController();