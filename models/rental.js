const { required } = require('joi');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                trim: true,
                required: true,
                max: 255
            },
            isGold: {
                type: Boolean,
                required: true
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            name: {
                type: String,
                trim: true,
                required: true,
                max: 255
            },
            dailyRentalRate: {
                type: Number,
                trim: true,
                required: true,
                min: 0,
                max: 500
            },
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    returnDate: {
        type: Date
    },
    rentalFees: {
        type: Number,
        default: 0,
        min: 0
    },
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports.rentalSchema = rentalSchema;
module.exports.model = Rental;