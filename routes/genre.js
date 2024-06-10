const express = require('express');
const router = express.Router();
const { model } = require('../models/genres');
const Joi = require('joi');
const validateObjectId = require('../util/checkObjectIdMiddleware')

const validate = (req, res, next) => {

    const schema = Joi.object({
        name: Joi.string()
            .min(5)
            .max(255)
            .required()
    }).options({ abortEarly: false });

    const validate = schema.validate(req.body);

    if (validate.error) {

        const errorMessages = validate.error.details.map(err => err.message);

        return res.status(422).send(errorMessages);
    }

    next();
}

function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    }
}

router.get('/', asyncMiddleware(async (req, res) => {
    // throw new Error('gener errors');
    const genres = await model.find();
    return res.send(genres);
}));

router.get('/', async function (req, res, next) {
    try {
        const genres = await model.find();
        return res.send(genres);
    } catch (error) {
        next(error);
    }
});

router.post('/', validate, async function (req, res) {

    const genre = new model({
        name: req.body.name
    });

    await genre.save();

    res.send(genre);
});

router.put('/:id', validateObjectId, async function (req, res, next) {
    const id = req.params.id;
    const genre = await model.findByIdAndUpdate(id, {
        name: req.body.name
    },
        { new: true });

    if (!genre) {
        return res.send('Do not found');
    }

    res.send(genre);
});

router.delete('/:id', validateObjectId, async function (req, res, next) {
    const id = req.params.id;

    const genre = await model.findByIdAndDelete(id);

    if (!genre) {
        return res.send('Do not found');
    }

    return res.send('deleted successfully.');
});

router.get('/:id', validateObjectId, asyncMiddleware(async function (req, res) {

    const id = req.params.id;

    const genre = await model.findById(id);

    if (!genre) {
        return res.status(404).send('Do not found');
    }
    return res.send(genre);
}));




module.exports = router;