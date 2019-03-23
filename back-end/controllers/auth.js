const jwt = require('jsonwebtoken');
const CONSTANTS = require('../conf/Constants').CONSTANTS;
const User = require('../models/index').User;
const axios = require('axios');

module.exports.login = async (req, res) => {

    if (!req.body.token || req.body.token === "") {
        return res.status(400).send({ message: "Token is not present!" });
    }

    let googleResponse = await axios.get("https://oauth2.googleapis.com/tokeninfo?id_token=" + req.body.token);

    let user = await User.findOne({
        where: {
            email: googleResponse.data.email
        },
        raw: true
    })

    if (!user) {
        user = await User.create({
            firstname: googleResponse.data.given_name,
            lastname: googleResponse.data.family_name,
            email: googleResponse.data.email,
            photo: googleResponse.data.picture
        })
    }

    let token = jwt.sign({ id: user.id, email: user.email }, CONSTANTS.JWT_SECRET, { expiresIn: '168h' });

    return res.status(201).send({
        token: token, firstname: user.firstname, lastname: user.lastname,
        email: user.email, owner: user.isOwner,
        photo: user.photo
    });
}