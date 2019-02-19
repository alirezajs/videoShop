const controller = require('app/http/controllers/controller');
const Weblog = require('app/models/weblog');
const Category = require('app/models/category');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const request = require('request-promise');

class weblogCongroller extends controller {

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

        let wblog = Weblog.find({ ...query });


        if (req.query.order)
            wblog.sort({ createdAt: 1 })
        else
            wblog.sort({ createdAt: -1 })

        wblog = await wblog.exec();

        let categories = await Category.find({});
        res.render('home/weblog', { weblog: wblog, categories });
    }
   

    async single(req, res) {
        let course = await Weblog.findOneAndUpdate({ slug: req.params.course }, { $inc: { viewCount: 1 } })
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

        let courses = await Weblog.find({ lang: req.getLocale() }).sort({ createdAt: -1 }).limit(3).exec();
        let episode={};
        res.render('home/single-weblog', { course, categories, courses,episode });
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


            let course = await Weblog.findOneAndUpdate({ slug: req.params.course }, { $inc: { viewCount: 1 } })
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

            let courses = await Weblog.find({ lang: req.getLocale() }).sort({ createdAt: -1 }).limit(3).exec();

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

module.exports = new weblogCongroller();