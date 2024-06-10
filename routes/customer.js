const express = require('express');
const router = express.Router();
const model = require('../models/customer');
const Joi = require('joi');

const validate = (req, res, next) => {
    
    const schema = Joi.object({
        name: Joi.required(),
        phone: Joi.required(),
        is_gold: Joi.required(),
    }).options({abortEarly : false})


    const validate = schema.validate(req.body);

    if(validate.error){

        const errorMessages = validate.error.details.map(err => err.message);

        return res.send(errorMessages);
    }

    next();
}

router.get('/', async function (req, res, next) {
    const customers = await model.find();
    res.send(customers);
});

router.post('/', validate, async function (req, res, next) {
    const customer = new model({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.is_gold
    });

    await customer.save();

    res.send(customer);
});

router.put('/:id', async function (req, res, next) {
    const id = req.params.id;
    const customer = await model.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.is_gold
    },
        { new: true });

    if (!customer) {
        return res.send('Do not found');
    }

    res.send(customer);
});

router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;

    const customer = await model.findByIdAndDelete(id);

    if (!customer) {
        return res.send('Do not found');
    }

    return res.send('deleted successfully.');
});

router.get('/:id', async function (req, res, next) {
    const id = req.params.id;
    const customer = await model.findById(id);

    if (!customer) {
        return res.send('Do not found');
    }
    return res.send(customer);
});




module.exports = router;