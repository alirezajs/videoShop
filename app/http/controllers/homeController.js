const controller = require('app/http/controllers/controller');
const Course = require("../../models/course");
const Episode = require("../../models/episode");
const Comment = require("../../models/comment");
const sm = require('sitemap');
const rss = require('rss');
const striptags = require('striptags');

class homeController extends controller {

    async index(req, res) {
        let courses = await Course.find({lang:req.getLocale()}).sort({ createdAt: -1 }).limit(6).exec();
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

    async sitemap(req , res , next) {
        try {
            let sitemap = sm.createSitemap({
                hostname : config.siteurl,
                // cacheTime : 600000
            });

            sitemap.add({ url : '/' , changefreq : 'daily' ,priority : 1 });
            sitemap.add({ url : '/courses' , priority : 1});


            let courses = await Course.find({ }).sort({ createdAt : -1 }).exec();
            courses.forEach(course => {
                sitemap.add({ url : course.path() , changefreq : 'weekly' , priority : 0.8 })
            })

            let episodes = await Episode.find({ }).populate('course').sort({ createdAt : -1 }).exec();
            episodes.forEach(episode => {
                sitemap.add({ url : episode.path() , changefreq : 'weekly' , priority : 0.8 })
            })

            res.header('Content-type' , 'application/xml');
            res.send(sitemap.toString());

        } catch (err) {
            next(err);
        }
    }

    async feedCourses(req , res , next) {
        try {
            let feed = new rss({
                title : 'فید خوان دوره های باهوش ها',
                description : 'جدیدترین دوره ها را از طریق rss بخوانید',
                feed_url : `${config.siteurl}/feed/courses`,
                site_url : config.site_url,
            });

            let courses = await Course.find({ }).populate('user').sort({ createdAt : -1 }).exec();
            courses.forEach(course => {
                feed.item({
                    title : course.title,
                    description : striptags(course.body.substr(0,100)),
                    date : course.createdAt,
                    url : course.path(),
                    author : course.user.name
                })
            })

            res.header('Content-type' , 'application/xml');
            res.send(feed.xml());

        } catch (err) {
            next(err);
        }
    }

    async feedEpisodes(req , res , next) {
        try {
            let feed = new rss({
                title : 'فید خوان جلسات دوره های های باهوش ها',
                description : 'جدیدترین دوره ها را از طریق rss بخوانید',
                feed_url : `${config.siteurl}/feed/courses`,
                site_url : config.site_url,
            });

            let episodes = await Episode.find({ }).populate({ path :'course' , populate : 'user'}).sort({ createdAt : -1 }).exec();
            episodes.forEach(episode => {
                feed.item({
                    title : episode.title,
                    description : striptags(episode.body.substr(0,100)),
                    date : episode.createdAt,
                    url : episode.path(),
                    author : episode.course.user.name
                })
            })

            res.header('Content-type' , 'application/xml');
            res.send(feed.xml());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new homeController();