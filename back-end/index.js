const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const CONSTANTS = require('./conf/Constants').CONSTANTS;
const router = require('./routes/index');

app.use(bodyParser());

app.use(router);

app.listen(CONSTANTS.PORT, () => {
    console.log("server started on: http://localhost:" + CONSTANTS.PORT);
});