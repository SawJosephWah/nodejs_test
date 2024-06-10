const express = require('express');
const customerRouter = require('../routes/customer');
const genreRouter = require('../routes/genre');
const movieRouter = require('../routes/movie');
const rentalRouter = require('../routes/rental');
const authRouter = require('../routes/auth');
const error = require('./error');
const cors = require('cors')
const cookieParser = require('cookie-parser')

module.exports = (app) => {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5600');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
    app.use(cookieParser())
    app.use(cors())
    app.use(express.json());

    app.use('/customers', customerRouter);
    app.use('/genres', genreRouter);
    app.use('/movies', movieRouter);
    app.use('/rentals', rentalRouter);
    app.use('/auth', authRouter);

    app.use(error);
}