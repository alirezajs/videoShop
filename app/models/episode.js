const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcrypt');

const episodeSchema = Schema({
    course : { type : Schema.Types.ObjectId , ref : 'Course'},
    title : { type : String , required : true },
    type : { type : String , required : true },
    body : { type : String , required : true },
    time : { type : String , default : '00:00:00' },
    number : { type : Number , required : true },
    videoUrl : { type : String , required : true },
    downloadCount : { type : Number , default : 0 },
    viewCount : { type : Number , default : 0 },
    commentCount : { type : Number , default : 0 },
} , { timestamps : true });

episodeSchema.plugin(mongoosePaginate);

episodeSchema.methods.typeToPersian = function() {
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

episodeSchema.methods.download = function(check , user) {
    if(! check) return '#';

    let status = false;
    if(this.type == 'free') {
        status = true;
    } else if(this.type == 'vip') {
        status = user.isVip();
    } else if(this.type == 'cash') {
        status = user.checkLearning(this.course)
    }

    let timestamps = new Date().getTime() + 3600 * 1000 * 12;

    let text = `aQTR@!#Fa#%!@%SDQGGASDF${this.id}${timestamps}`

    let salt = bcrypt.genSaltSync(15);
    let hash = bcrypt.hashSync(text , salt); 
    

    return status ? `/download/${this.id}?mac=${hash}&t=${timestamps}` : '#';
}

episodeSchema.methods.path = function() {
    return `${this.course.path()}/${this.number}`;
}

episodeSchema.methods.inc = async function(field , num = 1) {
    this[field] += num;
    await this.save();
} 

module.exports = mongoose.model('Episode' , episodeSchema);