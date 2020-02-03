const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let SALT = 10;

const schema = new Schema({
    qualifications : [String],
    first : {type : String, unique: true, required: true},
    last : {type : String, unique: true, required: true},
    rating: {type : Schema.Types.Decimal128, required: false},
    topics : [String],
    location: {type: String, required: true}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Tutor', schema);