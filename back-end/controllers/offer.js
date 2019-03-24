const Offer = require('../models/index').Offer;
const Place = require('../models/index').Place;

module.exports.getAllOfferForOwner = async (req, res) => {
    let place = await Place.findOne({
        where: {
            userId: req.user.id
        }
    });

    if (!place) {
        res.status(400).send({ message: "You are not an owner!" });
    }

    let offers = await Offer.findAll({
        where: {
            placeId: place.id
        }
    })

    return res.status(200).send({ offers });
}


module.exports.getAllOffers = async (req, res) => {

    let offers = await Offer.findAll({
        where: {
            placeId: req.params.id
        }
    })

    return res.status(200).send({ offers });
}


module.exports.createOffer = async (req, res) => {

    let place = await Place.findOne({
        where: {
            userId: req.user.id
        }
    });

    if (!place) {
        res.status(400).send({ message: "You are not an owner!" });
    }

    let newOffer = await Offer.create({
        offer: req.body.offer,
        placeId: place.id
    })

    return res.status(200).send({ newOffer });
}


module.exports.deleteOffer = async (req, res) => {

    let place = await Place.findOne({
        where: {
            userId: req.user.id
        }
    });

    if (!place) {
        res.status(400).send({ message: "You are not an owner!" });
    }

    let offer = await Offer.findOne({
        where: {
            placeId: place.id,
            id: req.params.id
        }
    });

    if (!offer) {
        res.status(404).send({ message: "Offer not found!" });
    }

    await offer.destroy();
    res.status(200).send({ message: "Deleted!" });
}