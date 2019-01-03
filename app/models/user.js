const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name : { type : String , require : true },
    admin : { type : Boolean ,  default : 0 },
    email : { type : String , unique : true  ,require : true},
    password : { type : String ,  require : true }
} , { timestamps : true });

userSchema.pre('save' , function(next) {

    bcrypt.hash(this.password , bcrypt.genSaltSync(15) , (err, hash) => {
        if(err) console.log(err);
        this.password = hash;
        next();
    });

})

module.exports = mongoose.model('User' , userSchema);