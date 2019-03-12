const controller = require('app/http/controllers/controller');
// const Setting = require('app/models/setting');

class indexController extends controller {
    index(req, res, next) {
        res.render('admin/index');
    }
    // setting(req, res, next) {

    //     let setting = Setting.find({ lang: req.query.lang });
    //     res.send("test");
    //     // res.render('admin/setting', setting);
    // }
    details(req, res, next) {

    }

    uploadImage(req, res) {
        let image = req.file;
        res.json({
            "uploaded": 1,
            "fileName": image.originalname,
            "url": `${image.destination}/${image.filename}`.substring(8)
        });
    }
}

module.exports = new indexController();