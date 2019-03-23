const Place = require('../models/index').Place;
const User = require('../models/index').User;
const Favorite = require('../models/index').Favorite;
const CONSTANTS = require('../conf/Constants').CONSTANTS;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//send a boolean to see in front if is already favorite for current user
const getPlace = async (req, res) => {
    if (!req.params.id) {
        return req.status(400).send({ message: "Request data is malformed" });
    }

    let place = await Place.findOne({
        where: {
            id: req.params.id
        }
    });

    let isFavorite = await Favorite.findOne({
        where: {
            user_id: req.user.id,
            place_id: place.id
        }
    })

    return res.status(200).send({ place: place, isFavorite: isFavorite ? true : false });
}

//receives a list of 
const findRegisteredPlaces = async (req, res) => {


}

const addFavoritePlace = async (req, res) => {

    let place = await Place.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!place) {
        return res.status(404).send({ message: "Place not found" });
    }

    await Favorite.create({
        Place_id: place.id,
        User_id: req.user.id
    });

    return res.status(201).send({ message: "Added to favorite" });
}

const getFavoritePlaces = async (req, res) => {

    let favorites = await Favorite.findAll({
        where: {
            User_id: req.user.id
        }
    });

    let favoriteIds = favorites.map(favorite => favorite.User_id);

    let places = await Place.findAll({
        where: {
            id: {
                [Op.in]: favoriteIds
            }
        }
    })

    return res.status(200).send({ places });
};

const createPlace = async (req, res) => {

    if (!req.body || !req.files.menu) {
        return res.status(400).send({ message: "Body is empty" });
    }

    let user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    if (user.isOwner) {
        return res.status(400).send({ message: "You already own a place" });
    } else {

        let filename = user.id + "_" + req.body.name.replace(" ", "").toLowerCase() + ".pdf";
        await req.files.menu.mv(CONSTANTS.FILES + "/" + filename);

        let place = await Place.create({
            mapsId: req.body.mapsId,
            name: req.body.name,
            address: req.body.address,
            coordinates: req.body.coordinates,
            userId: req.user.id,
            menu: filename
        });

        /*uncomment when finished
        await user.update({
            isOwner: true
        });
        */

        return res.status(201).send({ place: place });
    }
}

const updatePlace = async (req, res) => {

    if (!req.params.id || !req.body) {
        return req.status(400).send({ message: "Request data is malformed" });
    }

    let place = await Place.findOne({
        where: {
            id: req.params.id
        }
    });

    if (req.files) {
        let filename = req.user.id + "_" + req.body.name.replace(" ", "").toLowerCase() + ".pdf";
        await req.files.menu.mv(CONSTANTS.FILES + "/" + filename);

        place = await Place.create({
            mapsId: req.body.mapsId,
            name: req.body.name,
            address: req.body.address,
            coordinates: req.body.coordinates,
            userId: req.user.id,
            menu: filename
        });
    } else {
        place = await Place.create({
            mapsId: req.body.mapsId,
            name: req.body.name,
            address: req.body.address,
            coordinates: req.body.coordinates,
            userId: req.user.id,
            menu: filename
        });
    }

    return res.status(200).send({ place });
}

module.exports = {
    getPlace,
    createPlace,
    updatePlace,
    addFavoritePlace,
    getFavoritePlaces
}