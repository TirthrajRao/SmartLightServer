const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fname: { type: String },
    lname: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    mobile: { type: String, default: null }
});

module.exports = mongoose.model('users', userSchema);