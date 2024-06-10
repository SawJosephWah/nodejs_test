
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 5,
        max: 255
    }
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports.model = Genre;
module.exports.genreSchema = genreSchema;