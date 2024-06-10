const mongoose = require('mongoose');

function validateObjectId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('Invalid ObjectId');
    }
    next();
}

module.exports = validateObjectId;