//TODO: decide how the schema should be defined.
//Should the tutor/tutee be referenced in a user model, or should the tutor and tutee have there own logins.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const ObjectId = Schema.ObjectId;

let SALT = 10;

const schema = new Schema({
    email: { type: String, unique: true, required: true },
    pass : {type: String, unique: true, required: true}, 
    tutorID: {type: ObjectId, required: false},
    tuteeID: {type: ObjectId, required: false}
});

schema.pre("save", function (next){
    var user = this;
    
    if(user.isModified('pass')){
        bcrypt.genSalt(SALT, (err, salt)=>{
            if(err) return next(err);

            bcrypt.hash(user.pass, salt, (err, hash)=>{
                if(err) return next(err);
                user.pass = hash;
                next();
            })
        })
    }else{
        next();
    }
})

schema.set('toJSON', { virtuals: true });

schema.methods.comparePass = function(candPass, checkPass){

    bcrypt.compare(candPass, this.pass, (err, isMatch)=>{
        if(err) return checkPass(err);
        checkPass(null, isMatch);
    })
}

module.exports = mongoose.model('User', schema);