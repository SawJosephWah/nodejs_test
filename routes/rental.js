const mongoose = require("mongoose");
const express = require('express')
const router = express.Router()
const { model } = require('../models/rental')
const { model: movieModel } = require('../models/movies')
const customerModel = require('../models/customer')
const Joi = require('joi');
const moment = require('moment');

const validate = (req, res, next) => {

    const schema = Joi.object({
        customer: Joi
            .string()
            .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
            .required()
            .messages({
                "string.pattern.base": "customer Id is Invalid object ID"
            }),
        movie: Joi.string()
            .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
            .required()
            .messages({
                "string.pattern.base": "Movie id is Invalid object ID"
            }),
        date_out: Joi.date().required(),
        return_date: Joi.date(),
        rental_fees: Joi.number().min(0)
    }).options({ abortEarly: false });

    const validate = schema.validate(req.body);

    if (validate.error) {
        return res.send(validate.error.details.map(err => err.message));
    }

    return next();

}

router.get('/', async (req, res) => {

    const rentals = await model.find();

    res.send(rentals);
})

// router.post('/', validate, async (req, res) => {

//     const movie = await movieModel.findById(req.body.movie);
//     if (!movie) {
//         return res.send('Movie not found');
//     }

//     if (movie.numberInstock === 0) {
//         return res.send('Movie does not have instock');
//     }

//     const customer = await customerModel.findById(req.body.customer);
//     if (!customer) {
//         return res.send('Customer not found');
//     }

//     const rental = new model({
//         customer: {
//             name: customer.name,
//             isGold: customer.isGold,
//         },
//         movie: {
//             name: movie.title,
//             dailyRentalRate: movie.dailyRentalRate,
//         },
//         dateOut: req.body.date_out,
//         returnDate: req.body.return_date,
//         rentalFees: req.body.rental_fees,
//     })



//     // await rental.save();

//     // await movieModel.findByIdAndUpdate(req.body.movie, {
//     //     numberInstock: updateInstock
//     // });

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         await rental.save({ session });

//         let updateInstock = --movie.numberInstock;
//         await mongoose.model('Movie').findByIdAndUpdate(req.body.movie, {
//             numberInstock: updateInstock
//         }, { session });

//         await session.commitTransaction();
//         session.endSession();
//         return res.send(rental);
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.send(error);
//     }



// })

router.post('/', validate, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const movie = await movieModel.findById(req.body.movie).session(session);
            if (!movie) {
                throw new Error('Movie not found');
            }

            if (movie.numberInstock === 0) {
                throw new Error('Movie is out of stock');
            }

            const customer = await customerModel.findById(req.body.customer).session(session);
            if (!customer) {
                throw new Error('Customer not found');
            }

            // Create rental document
            const rental = new model({
                customer: {
                    name: customer.name,
                    isGold: customer.isGold,
                },
                movie: {
                    title: movie.title,
                    dailyRentalRate: movie.dailyRentalRate,
                },
                dateOut: req.body.date_out,
                returnDate: req.body.return_date,
                rentalFees: req.body.rental_fees,
            });

            await rental.save({ session });

            // Update movie stock
            movie.numberInstock--;
            await movie.save({ session });

            res.json(rental);
        });
    } catch (error) {
        console.error('Transaction aborted:', error);
        res.status(500).send(error);
    } finally {
        session.endSession();
    }
});

router.post('/return', async (req, res) => {

    const customerId = req.body.customer_id;
    const movieId = req.body.movie_id;

    if (!customerId) return res.status(400).json({ message: "Customer ID is required" })
    if (!movieId) return res.status(400).json({ message: "Movie ID is required" })

    const customer = await model.findOne({ 'customer._id': customerId });
    if (!customer) return res.status(400).json({ message: "No rental data with customer Id" })

    const movie = await model.findOne({ 'movie._id': movieId });
    if (!movie) return res.status(400).json({ message: "No rental data with customer Id" })

    const rental = await model.findOne({ 'customer._id': customerId, 'movie._id': movieId });
    if (!rental) return res.status(400).json({ message: "No rental data found" });

    // Calculate rental fees
    const returnDate = moment();
    // console.log(returnDate);
    const createdDate = moment(rental.dateOut);
    console.log(createdDate);
    const dateDifference = returnDate.diff(createdDate, 'days');
    // console.log(dateDifference);

    // Calculate rental fees
    const dailyRentalRate = rental.movie.dailyRentalRate;
    const rentalFees = dailyRentalRate * dateDifference;

    rental.rentalFees = rentalFees;
    rental.returnDate = returnDate;
    await rental.save();

    return res.status(200).json({
        return: true
    })
});


module.exports = router