const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const teacherSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true },
    expertise: { type: String, require: true },
    slug: { type: String, required: true },
    body: { type: String, required: true },
    images: { type: Object, required: true },
    thumb: { type: String, required: true },
    tags: { type: String, required: true },
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    email: { type: String, require: false },
    facebook: { type: String, require: false },
    instagram: { type: String },
    showInMain: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true } });

teacherSchema.plugin(mongoosePaginate);


teacherSchema.methods.path = function () {
    return `/teachers/${this.slug}`;
}

teacherSchema.methods.inc = async function (field, num = 1) {
    this[field] += num;
    await this.save();
}


teacherSchema.virtual('teachers', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'teachers'
});
teacherSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'course'
})


module.exports = mongoose.model('Teacher', teacherSchema);