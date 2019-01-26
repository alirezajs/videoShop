const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcrypt');

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
}, { timestamps: true, toJSON: { virtuals: true } });

EpisodeSchema.plugin(mongoosePaginate);

EpisodeSchema.methods.typeToPersian = function () {
    switch (this.type) {
        case 'cash':
            return 'نقدی'
            break;
        case 'vip':
            return 'اعضای ویژه'
            break;
        default:
            return 'رایگان'
            break;
    }
}

EpisodeSchema.methods.download = function (req) {
    if (!req.isAuthenticated()) return '#';


    let status = false;
    switch (this.type) {
        case 'free':
            status = true;
            break;
        case 'vip':
            status = req.status.isVip();
            breakl
        case 'cash':
            status = req.user.checkLearning(this.course)
            break;
    }
    //12 ساعت آینده
    let timestamps = new Date().getTime() + 3600 * 1000 * 12;

    let text = `aQTRQ!#fa38r47sjkhdjfsf${this.id}${timestamps}`;

    let salt = bcrypt.genSaltSync(15);
    let hash = bcrypt.hashSync(text, salt);

    return status ? `/download/${this.id}?mac=${hash}&t=${timestamps}` : "#";
}

EpisodeSchema.methods.path = function () {
    return `${this.course.path()}/${this.number}`;
}


module.exports = mongoose.model('Episode', EpisodeSchema);