const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class episodesController extends controller {
    async index(req, res) {
        try {
            let page = req.query.page || 1;
            let episodes = await Episode.paginate({}, { page, sort: { createdAt: 1 }, limit: 2 });
            res.render('admin/episodes/index', { title: 'ویدیو ها', episodes });
        } catch (err) {
            next(err);
        }
    }

    async create(req, res) {
        let courses = await Course.find({});
        res.render('admin/episodes/create', { courses });
    }

    async store(req, res, next) {
        try {
            let status = await this.validationData(req);
            if (!status) {
                return this.back(req, res);
            }


            let newEpisode = new Episode({ ...req.body });

            await newEpisode.save();

            this.updateCourseTime(newEpisode.course);


            return res.redirect('/admin/episodes');
        } catch (err) {
            next(err);
        }
    }

    async edit(req, res, next) {

        try {
            this.isMongoId(req.params.id);

            let episode = await Episode.findById(req.params.id);
            if (!episode) this.error('چنین ویدیویی وجود ندارد', 404);

            let courses = await Course.find({});

            return res.render('admin/episodes/edit', { episode, courses });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            let status = await this.validationData(req);
            if (!status) {
                return this.back(req, res);
            }

            let objForUpdate = {};




            await Episode.findByIdAndUpdate(req.params.id, { $set: { ...req.body } });

            // prev course time update
            this.updateCourseTime(Episode.course);
            // now course time update
            this.updateCourseTime(req.body.course);

            return res.redirect('/admin/episodes');
        } catch (err) {
            next(err);
        }
    }

    async destroy(req, res, next) {
        try {
            this.isMongoId(req.params.id);

            let episode = await Episode.findById(req.params.id);
            if (!episode) this.error('چنین ویدئو ی ای وجود ندارد', 404);

            let courseId = episode.course;
            // delete courses
            episode.remove();

            this.updateCourseTime(courseId);

            return res.redirect('/admin/episodes');
        } catch (err) {
            next(err);
        }
    }

    async updateCourseTime(courseId) {
        if (!courseId) {
            console.log("کد درس وجود ندارد")
            return;
        }

        let course = await Course.findById(courseId);
        let episodes = await Episode.find({ course: courseId });
        course.set({ time: this.getTime(episodes) });
        await course.save();
    }


}

module.exports = new episodesController();