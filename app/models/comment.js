const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const commentSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    approved: { type: Boolean, required: false },
    course: { type: Schema.Types.ObjectId, ref: 'Course', default: undefined },
    episode: { type: Schema.Types.ObjectId, ref: 'Episode', default: undefined },
    comment: { type: String, require: true },

}, { timestamps: true, toJSON: { virtuals: true } });

commentSchema.plugin(mongoosePaginate);





module.exports = mongoose.model('Comment', commentSchema);