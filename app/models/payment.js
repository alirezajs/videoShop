const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const paymentSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User' },
    course : { type : Schema.Types.ObjectId , ref : 'Course' , default : null },
    vip : { type : Boolean , default : false },
    resnumber : { type : String , required : true},
    price : { type : Number , required : true},
    payment : { type : Boolean , default : false },
} , { timestamps : true , toJSON : { virtuals : true } });

paymentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Payment' , paymentSchema);