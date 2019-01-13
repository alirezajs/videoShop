const controller = require('app/http/controllers/controller');

class courseController extends controller {
    index(req, res) {
        res.render('admin/courses/index', {
            title: 'دوره ها'
        });
    }
    create(req, res) {
        res.render('admin/courses/create');
    }

    async store(req, res) {
        let result = this.validationData(req);
        if (!result) 
            this.back(req, res);
        }

        //images
        //create course

    }

module.exports = new courseController();