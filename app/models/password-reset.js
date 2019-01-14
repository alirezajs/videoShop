const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const passwordReset = mongoose.Schema({
    email : { type : String , required : true},
    token : { type : String , required : true} ,
    use : { type : Boolean , default : false }
} , { timestamps : { updatedAt : false } });


module.exports = mongoose.model('passwordReset' , passwordReset);