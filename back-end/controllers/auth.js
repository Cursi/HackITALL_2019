const jwt = require('jsonwebtoken');
const CONSTANTS = require('../conf/Constants').CONSTANTS;

module.exports.login = (req, res) => {
    let token = jwt.sign({name: "test"}, CONSTANTS.JWT_SECRET);
    res.send({message: token});
}