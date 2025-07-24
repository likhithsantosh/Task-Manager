const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    
});

module.exports = mongoose.model('user',userSchema)