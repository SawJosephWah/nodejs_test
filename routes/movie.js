
const express = require('express');
const router = express.Router();
const { valiate, model } = require('../models/movies');
const { model: genreModel } = require('../models/genres')

const handleMiddleware = (handler) => {
    return (req, res) => {
        try {
            handler(req, res);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

router.get('/', handleMiddleware(function (req, res) {
        throw new Error('movies testing');
        res.send('All movies');
}));

router.post('/', valiate, async function (req, res) {

    const genreId = req.body.genre_id;

    const genre = await genreModel.findById(genreId);
    if (!genre) {
        return res.send('Genre does not found.');
    }

    const movie = new model({
        title: req.body.title,
        genre: genre,
        numberInstock: req.body.number_instock,
        dailyRentalRate: req.body.daily_rental_rate,
    })

    await movie.save();

    res.send(movie);
});

router.get('/:id', function (req, res) {

    const id = req.params.id;

    res.send(`Movie ${id}`);

});

router.put('/:id', function (req, res) {

    const id = req.params.id;

    res.send(`Movie ${id}`);
});

router.delete('/:id', function (req, res) {

    const id = req.params.id;

    res.send(`Delete Movie ${id}`);
});

module.exports = router;