const express = require('express');
const router = express.Router();
const CONSTANTS = require('../conf/Constants').CONSTANTS;
const Auth = require('./auth');
const jwt = require('express-jwt');

router.use("/login", Auth);
router.use(jwt({secret: CONSTANTS.JWT_SECRET}));

router.get("/", (req, res) => {
    res.status(200).send({message: "Welcome to back"});
})

module.exports = router;