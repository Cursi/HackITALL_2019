const express = require('express');
const router = express.Router();
const CONSTANTS = require('../conf/Constants').CONSTANTS;
const Auth = require('./auth');
const Place = require('./place');
const Offer = require('./offer');
const jwt = require('express-jwt');
const Push = require('../controllers/push');

//public
router.use("/login", Auth);

router.use(jwt({ secret: CONSTANTS.JWT_SECRET }));

//auth required
router.use('/place', Place);
router.use("/offer", Offer);

router.post("/subscribe", Push.subscribe);
router.post("/notification", Push.sendNotifications);

router.get("/", (req, res) => {
    console.log(__dirname);
    console.log(req.user);
    res.status(200).send({ message: "Welcome to back" });
})

module.exports = router;