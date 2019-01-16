const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class courseController extends controller {
    async index(req, res) {
        let courses = await Course.find({}).sort({ createdAt: 1 });

        res.render('admin/courses/index', { title: 'دوره ها', courses });
    }

    create(req, res) {
        res.render('admin/courses/create');
    }

    async store(req, res) {
        let status = await this.validationData(req);
        if (!status) {
            if (req.file)
                fs.unlink(req.file.path, (err) => { });
            return this.back(req, res);
        }

        // create course
        let images = this.imageReasize(req.file);
        let { title, body, type, price, tags } = req.body;

        let newCourse = new Course({
            user: req.user._id,
            title,
            slug: this.slug(title),
            body,
            type,
            price,
            images: JSON.stringify(images),
            tags
        });

        await newCourse.save();

        return res.redirect('/admin/courses');
    }
    imageReasize(image) {
        const imageInfo = path.parse(image.path);

        let addresImages = {};
        addresImages['original'] = this.getUrlImage(`${image.destination}/${image.filename}`);

        const resize = size => {
            let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;

            addresImages[size] = this.getUrlImage(`${image.destination}/${imageName}`);

            sharp(image.path)
                .resize(size, null)
                .toFile(`${image.destination}/${imageName}`);
        }

        [1080, 720, 480].map(resize);

        return addresImages;

    }
    getUrlImage(dir) {
        return dir.substring(8);
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }
}

module.exports = new courseController();