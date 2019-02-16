const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const weblogSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    categories : [{ type : Schema.Types.ObjectId , ref : 'Category'}],
    title : { type : String , required : true },
    slug : { type : String , required : true },
    body : { type : String , required : true },
    images : { type : Object , required : true },
    thumb : { type : String , required : true },
    tags : { type : String , required : true },
    viewCount : { type : Number , default : 0 },
    commentCount : { type : Number , default : 0 },
    lang : { type : String , required : true }
} , { timestamps : true , toJSON : { virtuals : true } });

weblogSchema.plugin(mongoosePaginate);


weblogSchema.methods.path = function() {
    return `/weblog/${this.slug}`;
}

weblogSchema.methods.inc = async function(field , num = 1) {
    this[field] += num;
    await this.save();
} 

weblogSchema.virtual('comments' , {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'weblog'
})


module.exports = mongoose.model('Weblog' , weblogSchema);