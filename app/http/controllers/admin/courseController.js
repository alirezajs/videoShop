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

}

module.exports = new courseController();