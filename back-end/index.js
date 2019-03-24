const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const CONSTANTS = require('./conf/Constants').CONSTANTS;
const router = require('./routes/index');
const morgan = require('morgan');
const db = require('./models/index').sequelize;
const cors = require('cors');
const fileupload = require('express-fileupload');

app.use(cors());
app.use(morgan());
app.use(bodyParser());
app.use(fileupload());

db.sync();

//static
app.use('/menu', express.static("files"))
app.use('/push', (req, res) => {return res.sendFile(__dirname + "/index.html");});
app.use(express.static('front'));

app.use(router);

app.listen(CONSTANTS.PORT, /*"192.168.43.235",*/ () => {
    console.log("server started on: http://localhost:" + CONSTANTS.PORT);
});