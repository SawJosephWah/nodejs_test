const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        max: 255,
        required: true
    },
    email: {
        type: String,
        max: 255,
        required: true
    },
    password: {
        type: String,
    },
});

const User = mongoose.model('user', userSchema);

module.exports.schema = userSchema;
module.exports.model = User;