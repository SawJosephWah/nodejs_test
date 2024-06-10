const express = require('express')
const app = express()
const port = 3000;

require('./startup/logger')();
require('./startup/db')();
require('./startup/routes')(app);

let server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = server;