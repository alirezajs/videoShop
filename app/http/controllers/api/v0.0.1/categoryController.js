const controller = require('app/http/controllers/api/controller');
const Category = require('app/models/category');


class categoryController extends controller {

    async categories(req, res, next) {
        try {

            let categories = await Category.find({ parent: null }).populate('childs');
            res.json({
                data: this.filterCoursesData(categories),
                status: 'success'
            })

        } catch (err) {
            this.failed(err.message, res);
        }
    }

    filterCoursesData(categories) {
        return {
            ...categories,
            docs: categories.map(cat => {
                return {
                    id: cat.id,
                    title: cat.title,
                    slug: cat.slug,

                }
            })
        }
    }


}

module.exports = new categoryController();