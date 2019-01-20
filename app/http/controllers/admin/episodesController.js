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

    create(req, res) {
        res.render('admin/episodes/create');
    }

    async store(req, res, next) {
        try {
            let status = await this.validationData(req);
            if (!status) {
                if (req.file)
                    fs.unlinkSync(req.file.path);
                return this.back(req, res);
            }

            // create course
            let images = this.imageResize(req.file);
            let { title, body, type, price, tags } = req.body;

            let newCourse = new Course({
                user: req.user._id,
                title,
                slug: this.slug(title),
                body,
                type,
                price,
                images,
                thumb: images[480],
                tags
            });

            await newCourse.save();

            return res.redirect('/admin/episodes');
        } catch (err) {
            next(err);
        }
    }

    async edit(req, res, next) {

        try {
            this.isMongoId(req.params.id);

            let course = await Course.findById(req.params.id);
            if (!course) this.error('چنین دوره ای وجود ندارد', 404);


            return res.render('admin/episodes/edit', { course });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            let status = await this.validationData(req);
            if (!status) {
                if (req.file)
                    fs.unlinkSync(req.file.path);
                return this.back(req, res);
            }

            let objForUpdate = {};

            // set image thumb
            objForUpdate.thumb = req.body.imagesThumb;

            // check image 
            if (req.file) {
                objForUpdate.images = this.imageResize(req.file);
                objForUpdate.thumb = objForUpdate.images[480];
            }

            delete req.body.images;
            objForUpdate.slug = this.slug(req.body.title);

            await Course.findByIdAndUpdate(req.params.id, { $set: { ...req.body, ...objForUpdate } })
            return res.redirect('/admin/episodes');
        } catch (err) {
            next(err);
        }
    }

    async destroy(req, res, next) {
        try {
            this.isMongoId(req.params.id);

            let course = await Course.findById(req.params.id);
            if (!course) this.error('چنین دوره ای وجود ندارد', 404);

            // delete episodes

            // delete Images
            Object.values(course.images).forEach(image => fs.unlinkSync(`./public${image}`));

            // delete courses
            course.remove();

            return res.redirect('/admin/episodes');
        } catch (err) {
            next(err);
        }
    }




}

module.exports = new episodesController();