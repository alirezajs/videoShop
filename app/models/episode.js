const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const EpisodeSchema = Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    title: { type: String, required: true },
    type: { type: String, required: true },
    body: { type: String, required: true },
    time: { type: String, default: '00:00:00' },
    number: { type: Number, required: true },
    videoUrl: { type: String, require: true },
    downloadCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    commentCount: { type: String, default: 0 },
}, { timestamps: true });

EpisodeSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Episode', EpisodeSchema);