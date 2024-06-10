
const mongoose = require('mongoose');
const { genreSchema } = require('../models/genres');
const Joi = require("joi");

const valiate = async (req, res, next) => {

    const schema = Joi.object({
        title: Joi.string()
            .trim()
            .min(3)
            .max(255)
            .required(),
        genre_id: Joi.string()
            .required()
            .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
            .messages({
                "string.pattern.base": `Invalid genre id`,
            })
    }).options({ abortEarly: false })

    const validate = schema.validate(req.body);

    if (validate.error) {
        return res.send(validate.error.details.map(err => err.message));
    }

    next();

}

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 255
    },
    genre: genreSchema,
    numberInstock: {
        type: Number,
        default: 0,
        max: 10
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        max: 25
    }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports.movieSchema = movieSchema;
module.exports.model = Movie;
module.exports.valiate = valiate;