const controller = require('app/http/controllers/api/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const Category = require('app/models/category');

const Comment = require('app/models/comment');
const passport = require('passport');

class courseController extends controller {

    async courses(req, res, next) {
        try {
            let {
                search,
                type,
                category,
                page,
                pagesize,
                orderBy,
                orderType
            } = req.query;
            let query = {};

            if (search)
                query.title = new RegExp(search, 'gi');

            if (type && type != 'all')
                query.type = type;

            if (category && category != 'all') {
                category = await Category.findOne({
                    slug: category
                });
                if (category)
                    query.categories = {
                        $in: [category.id]
                    }
            }
            let orderQuery = {};
            if (orderBy) {
                orderQuery = await this.createFilter(orderBy, orderType);
            }



            let pageNumber = page || 1;
            let perPage = Number(pagesize) || 12;
            let courses = await Course.paginate({
                ...query
            }, {
                    pageNumber,
                    sort: {
                        ...orderQuery
                    },
                    limit: perPage,
                    populate: [{
                        path: 'categories'
                    }, {
                        path: 'user'
                    }]
                });

            res.json({
                data: this.filterCoursesData(courses),
                status: 'success'
            })

        } catch (err) {
            this.failed(err.message, res);
        }
    }

    filterCoursesData(courses) {
        return {
            ...courses,
            docs: courses.docs.map(course => {
                return {
                    id: course.id,
                    type: course.type,
                    title: course.title,
                    slug: course.slug,
                    body: course.body,
                    image: course.thumb,
                    categories: course.categories.map(cate => {
                        return {
                            name: cate.name,
                            slug: cate.slug
                        }
                    }),
                    user: {
                        id: course.user.id,
                        name: course.user.name
                    },
                    price: course.price,
                    createdAt: course.createdAt,
                    viewCount: course.viewCount,
                    commentCount: course.commentCount,
                    time: course.time

                }
            })
        }
    }
    async createFilter(orderBy, orderType) {
        let ordertypeExam = orderType == "asc" ? 1 : -1
        switch (orderBy) {
            case "createdAt":
                return {
                    createdAt: ordertypeExam
                }
            case "price":
                return {
                    price: ordertypeExam
                }
            case "title":
                return {
                    title: ordertypeExam
                }
            case "popular":
                return {
                    viewCount: ordertypeExam
                }
            default:
                return {}
        }

    }

    async singleCourse(req, res) {
        try {
            let course = await Course.findByIdAndUpdate(req.params.course, {
                $inc: {
                    viewCount: 1
                }
            })
                .populate([{
                    path: 'user',
                    select: 'name'
                },
                {
                    path: 'episodes',
                    options: {
                        sort: {
                            number: 1
                        }
                    }
                },
                {
                    path: 'categories',
                    select: 'name slug'
                },
                {
                    path: 'teachers',
                    select: 'fullName expertise'
                },
                {
                    path: 'comments',
                    match: {
                        parent: null,
                        approved: true
                    },
                    populate: [
                        {
                            path: 'user',
                            select: 'name'
                        },
                        {
                            path: 'comments',
                            match: {
                                approved: true
                            },
                            populate: { path: 'user', select: 'name' }
                        }
                    ]
                }
                ]);

            if (!course) return this.failed('چنین دوره ای یافت نشد', res, 404);

            passport.authenticate('jwt', {
                session: false
            }, (err, user, info) => {

                res.json({
                    data: this.filterCourseData(course, user),
                    status: 'success'
                });

            })(req, res);


        } catch (err) {
            this.failed(err.message, res);
        }
    }

    filterCourseData(course, user) {
        return {
            about_course: {
                course: {

                    id: course.id,
                    title: course.title,
                    slug: course.slug,
                    body: course.body,
                    image: course.thumb,
                    price: course.price,
                    createdAt: course.createdAt,
                    type: course.type,
                    viewCount: course.viewCount,
                    commentCount: course.commentCount,
                    time: course.time
                },
                categories: course.categories.map(cate => {
                    return {
                        name: cate.name,
                        slug: cate.slug
                    }
                }),
                teachers: course.teachers.map(teacher => {
                    return {
                        fullName: teacher.fullName,
                        expertise: teacher.expertise
                    }
                }),
                user: {
                    id: course.user.id,
                    name: course.user.name
                },
            },
            episodes: course.episodes.map(episode => {
                return {
                    time: episode.time,
                    downloadCount: episode.downloadCount,
                    viewCount: episode.viewCount,
                    commentCount: episode.commentCount,
                    id: episode.id,
                    title: episode.title,
                    body: episode.body,
                    type: episode.type,
                    number: episode.number,
                    createdAt: episode.createdAt,
                    download: episode.download(!!user, user)
                }
            }),
            comments: course.comments

        }
    }

    async commentForSingleCourse(req, res) {
        try {
            let comments = await Comment.find({
                course: req.params.course,
                parent: null,
                approved: true
            })
                .populate([{
                    path: 'user',
                    select: 'name'
                },
                {
                    path: 'comments',
                    match: {
                        approved: true
                    },
                    populate: {
                        path: 'user',
                        select: 'name'
                    }
                }
                ])
            return res.json(comments);
        } catch (err) {
            this.failed(err.message, res);
        }
    }
}

module.exports = new courseController();