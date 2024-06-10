const express = require('express')
const router = express.Router()
const { model } = require('../models/user');
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const Joi = require('joi');



const validate = (req, res, next) => {

    const complexityOptions = {
        min: 5,
        max: 250,
        lowerCase: 1,
        // upperCase: 1,
        // numeric: 1,
        // symbol: 1,
        // requirementCount: 2,
    };


    const schema = Joi.object({
        name: Joi.string().trim().max(255).required(),
        email: Joi.string().trim().email().max(255).required(),
        password: Joi.string().trim().max(15).required(),
        password: passwordComplexity(complexityOptions),
    }).options({ abortEarly: false });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }
    next();
}

const loginValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().trim().required(),
        password: Joi.string().trim().required(),
    }).options({ abortEarly: false });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }
    next();
}

const validateToken = (req, res, next) => {
    // Get token from headers, query parameters, or body
    const token = req.headers['authorization'] || req.query.token || req.body.token;

    if (!token) {
        return res.status(401).json({ error: 'Token is missing' });
    }

    const splitToken = token.split(' ')[1];

    // return res.send(token);
    // Verify token
    jwt.verify(splitToken, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

const validateRefreshToken = (req, res, next) => {
    // Get token from headers, query parameters, or body
    const token = req.headers['authorization'] || req.query.token || req.body.token;

    if (!token) {
        return res.status(401).json({ error: 'Token is missing' });
    }

    const splitToken = token.split(' ')[1];

    // return res.send(token);
    // Verify token
    jwt.verify(splitToken, 'refresh_secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.refreshToken = splitToken;
        next();
    });
};


router.post('/sign-up', validate, async (req, res) => {

    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await model.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new model({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ _id: newUser._id, name: name, email: email }, 'secret', { expiresIn: '1h' });
        // Generate refresh token
        const refreshToken = jwt.sign({ name, email }, 'refresh_secret', { expiresIn: '1m' });

        // res.header('asdhfj-auth-token', token);
        res.cookie('joseph-token', token, { maxAge: 900000, httpOnly: true });

        res.json({ token, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', loginValidate, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await model.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, 'secret', { expiresIn: '1h' });
        // Generate refresh token
        const refreshToken = jwt.sign({ name: user.name, email: user.email }, 'refresh_secret', { expiresIn: '1m' });

        // Set token in cookie
        res.cookie('token', token, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        // res.json({ haha: 'joseph' });

        res.json({ token, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/token-check', validateToken, (req, res, next) => {
    res.json({ testing: 'haah' })
})


router.post('/refresh-token', validateRefreshToken, (req, res) => {
    const refreshToken = req.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token is missing' });
    }

    // Verify refresh token
    jwt.verify(refreshToken, 'refresh_secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Generate new access token with 10 seconds expiration
        const accessToken = jwt.sign({ name: decoded.name, email: decoded.email }, 'secret', { expiresIn: '30s' });

        res.json({ accessToken });
    });
});

router.get('/me', validateToken, async (req, res) => {
    try {
        const user = await model.findById("6634fea706aa7ef2ac3fc8d9", 'name email -_id');

        return res.json(user);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

module.exports = router;