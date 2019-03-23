const User = require('../models/index').User;
const Credential = require('../models/index').Credential;
const Place = require('../models/index').Place;
const Favorite = require('../models/index').Favorite;
const webPush = require('web-push');
const publicVapidKey = "BB5TSKCv20m7fXlDs_IbCCr6xuto-GCjNbeGReyWbpkp44997ZO-oIZp3PlR2kW2ImMUPRRYB2wEBVUZYTPtDbU";
const privateVapidKey = "rxv18nTHOPEqx_-Bu7GLgwJx87UwXfav0TOd-BJQpnw";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

webPush.setVapidDetails('mailto:bisagalexstefan@gmail.com', publicVapidKey, privateVapidKey);

module.exports.subscribe = async (req, res) => {

    const subscription = req.body.subscription;

    let cred = await Credential.findOne({
        where: {
            endpoint: subscription.endpoint
        }
    });

    if (cred) {
        return res.status(200).send({ message: "Already subscribed" });
    }

    await Credential.create({
        endpoint: subscription.endpoint,
        p256: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId: req.user.id
    })

    return res.status(201).send({ message: "Registered to push notifications" });
}


module.exports.sendNotifications = async (req, res) => {

    let currentPlace = await Place.findOne({
        where: {
            userId: req.user.id
        }
    });

    if (!currentPlace) {
        return res.status(400).send({ message: "You are not an owner" });
    }

    res.status(200).send({ message: "Sending" });

    let favoriteUsersId = await Favorite.findAll({
        where: {
            place_id: currentPlace.id
        },
        attributes: ['user_id']
    });

    let idList = favoriteUsersId.map(user => user.dataValues.user_id);

    //favorite. send to all without any dat
    let favoriteUsers = await User.findAll({
        where: {
            id: {
                [Op.in]: idList
            }
        }
    });

    //not favorite. send to all with coords
    let user = await User.findAll({
        where: {
            id: {
                [Op.notIn]: idList
            }
        }
    });

    const allUserspayload = JSON.stringify({
        title: req.body.title, content: req.body.content,
        coordinates: currentPlace.coordinates,
        place: currentPlace.name, place_id: currentPlace.id
    });

    const favoriteUsersPayload = JSON.stringify({
        title: req.body.title, content: req.body.content,
        place: currentPlace.name, place_id: currentPlace.id
    });

    //push to favorite users
    favoriteUsers.forEach(async user => {
        let credentials = await Credential.findAll({
            where: {
                userId: user.id
            }
        });

        credentials.forEach(credential => {
            let keys = { p256dh: credential.p256, auth: credential.auth };
            let subscription = { endpoint: credential.endpoint, expirationTime: null, keys: keys };

            webPush
                .sendNotification(subscription, favoriteUsersPayload)
                .catch(err => console.error(err));
        })
    });

    //push to all users
    user.forEach(async user => {
        let credentials = await Credential.findAll({
            where: {
                userId: user.id
            }
        });

        credentials.forEach(credential => {
            let keys = { p256dh: credential.p256, auth: credential.auth };
            let subscription = { endpoint: credential.endpoint, expirationTime: null, keys: keys };

            webPush
                .sendNotification(subscription, allUserspayload)
                .catch(err => console.error(err));
        })
    });
}