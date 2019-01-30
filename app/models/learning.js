const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const learningSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    course : { type : Schema.Types.ObjectId , ref : 'learning'},
} , { timestamps : true , toJSON : { virtuals : true } });

learningSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Learning' , learningSchema);