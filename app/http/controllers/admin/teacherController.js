const controller = require('app/http/controllers/controller');
const Teacher = require('app/models/teacher');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Category = require("app/models/category");
class teacherController extends controller {
    async index(req, res, next) {
        try {
            let page = req.query.page || 1;
            let teachers = await Teacher.paginate({}, { page, sort: { createdAt: 1 }, limit: 20 });

            res.render('admin/teachers/index', { title: 'دوره ها', teachers: teachers });
        } catch (err) {
            next(err);
        }
    }

    async create(req, res) {

        res.render('admin/teachers/create');
    }

    async store(req, res, next) {
        try {
            console.log(req.body.showInMain);

            let status = await this.validationData(req);
            if (!status) {
                if (req.file)
                    fs.unlinkSync(req.file.path);
                return this.back(req, res);
            }

            // create teacher
            let images = this.imageResize(req.file);
            let { fullName, body, tags, expertise, facebook, email, instagram, showInMain } = req.body;

            let newTeacher = new Teacher({
                user: req.user._id,
                fullName,
                expertise,
                email,
                facebook,
                instagram,
                slug: this.slug(fullName),
                body,
                images,
                thumb: images[480],
                tags,
                showInMain: showInMain ? true : false
            });

            await newTeacher.save();

            return res.redirect('/admin/teachers');
        } catch (err) {
            next(err);
        }
    }

    async edit(req, res, next) {
        try {
            this.isMongoId(req.params.id);

            let teacher = await Teacher.findById(req.params.id);
            if (!teacher) this.error('چنین دوره ای وجود ندارد', 404);
            // req.courseUserId = teacher.user;
            // if (!req.userCan('edit-courses')) {
            //     this.error("شما اجازه دسترسی به این صفحه را ندارید", 403)
            // }

            return res.render('admin/teachers/edit', { teacher: teacher });
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
            objForUpdate.slug = this.slug(req.body.fullName);
            objForUpdate.showInMain = req.body.showInMain=="on" ? true : false;
            await Teacher.findByIdAndUpdate(req.params.id, { $set: { ...req.body, ...objForUpdate } })
            return res.redirect('/admin/teachers');
        } catch (err) {
            next(err);
        }
    }

    async destroy(req, res, next) {
        try {
            this.isMongoId(req.params.id);

            let teacher = await Teacher.findById(req.params.id).exec();
            if (!teacher) this.error('چنین دوره ای وجود ندارد', 404);


            // delete Images
            Object.values(teacher.images).forEach(image => fs.unlinkSync(`./public${image}`));

            // delete courses
            teacher.remove();

            return res.redirect('/admin/teachers');
        } catch (err) {
            next(err);
        }
    }

    imageResize(image) {
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

module.exports = new teacherController();