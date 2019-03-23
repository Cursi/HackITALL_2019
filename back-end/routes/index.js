const express = require('express');
const router = express.Router();
const CONSTANTS = require('../conf/Constants').CONSTANTS;
const Auth = require('./auth');
const Place = require('./place');
const jwt = require('express-jwt');
const Push = require('./push');

router.use("/login", Auth);
router.use(jwt({secret: CONSTANTS.JWT_SECRET}));
router.use('/place', Place);

router.get("/", (req, res) => {
    console.log(__dirname);
    console.log(req.user);
    res.status(200).send({message: "Welcome to back"});
})

router.post("/subscribe", Push.subscribe);
router.post("/notification", Push.sendNotifications);

module.exports = router;