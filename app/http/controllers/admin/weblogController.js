const controller = require('app/http/controllers/controller');
const Weblog = require('app/models/weblog');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Category = require("app/models/category");
class weblogController extends controller {
    async index(req, res, next) {
        try {
            let page = req.query.page || 1;
            let weblogs = await Weblog.paginate({}, {
                page,
                sort: {
                    createdAt: 1
                },
                limit: 20
            });

            res.render('admin/weblog/index', {
                title: 'همه پست های وبلاگ',
                weblogs
            });
        } catch (err) {
            next(err);
        }
    }

    async create(req, res) {
        let categories = await Category.find({});
        res.render('admin/weblog/create', {
            categories
        });
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
            let {
                title,
                body,
                tags,
                lang
            } = req.body;

            let newWeblog = new Weblog({
                user: req.user._id,
                title,
                slug: this.slug(title),
                body,
                images,
                thumb: images[480],
                tags,
                lang
            });

            await newWeblog.save();

            return res.redirect('/admin/weblog');
        } catch (err) {
            next(err);
        }
    }

    async edit(req, res, next) {
        try {
            this.isMongoId(req.params.id);

            let weblog = await Weblog.findById(req.params.id);
            if (!weblog) this.error('چنین دوره ای وجود ندارد', 404);
            req.courseUserId = weblog.user;


            let categories = await Category.find({});
            return res.render('admin/weblog/edit', {
                weblog,
                categories
            });
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

            await Weblog.findByIdAndUpdate(req.params.id, {
                $set: {
                    ...req.body,
                    ...objForUpdate
                }
            })
            return res.redirect('/admin/weblog');
        } catch (err) {
            next(err);
        }
    }

    async destroy(req, res, next) {
        try {
            this.isMongoId(req.params.id);

            let weblog = await Weblog.findById(req.params.id)
            if (!weblog) this.error('چنین دوره ای وجود ندارد', 404);

        
            // delete Images
            Object.values(weblog.images).forEach(image => fs.unlinkSync(`./public${image}`));

            // delete courses
            weblog.remove();

            return res.redirect('/admin/weblog');
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

module.exports = new weblogController();