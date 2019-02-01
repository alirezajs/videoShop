const controller = require('app/http/controllers/api/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const Comment = require('app/models/comment');


class courseController extends controller {

    async courses(req, res, next) {
        try {
            let page = req.query.page || 1;
            let courses = await Course.paginate({}, { page, sort: { createdAt: 1 }, limit: 12 });
           

            res.json({
                data: courses,
                status: 'success'
            })

        } catch (err) {
            this.failed(err.message, res);
        }
    }

    async singleCourse(req , res) {
        try {
            let course = await Course.findByIdAndUpdate(req.params.course , { $inc : { viewCount : 1}})
                                            .populate([
                                                {
                                                    path : 'user',
                                                    select : 'name'
                                                } ,
                                                {
                                                    path : 'episodes',
                                                    options : { sort : { number : 1} }
                                                }
                                            ]);
            if(! course ) return this.failed('چنین دوره ای یافت نشد', res , 404);


            res.json({
                data : course,
                status : 'success'
            })

        } catch (err) {
           this.failed(err.message , res);
        }
    }

    async commentForSingleCourse(req , res ) {
        try {
            let comments = await Comment.find({ course : req.params.course , parent : null , approved : true })
                .populate([
                    {
                        path : 'user',
                        select : 'name'
                    },
                    {
                        path : 'comments',
                        match : {
                            approved : true
                        },
                        populate : { path : 'user' , select : 'name'}
                    }   
                ])
            return res.json(comments);
        } catch (err) {
            this.failed(err.message , res);
        }
    }
}

module.exports = new courseController();