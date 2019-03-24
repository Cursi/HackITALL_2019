const Place = require('../models/index').Place;
const User = require('../models/index').User;
const Favorite = require('../models/index').Favorite;
const CONSTANTS = require('../conf/Constants').CONSTANTS;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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


const findRegisteredPlaces = async (req, res) => {
    if (!req.body) {
        return req.status(400).send({ message: "Bad Request" });
    }

    let returnPlaces = [];

    for (let i = 0; i < req.body.places.length; i++) {
        let foundPlace = await Place.findOne({
            where: {
                mapsId: req.body.places[i].id
            }
        });

        if (foundPlace) {
            returnPlaces.push({
                id: foundPlace.id,
                mapsId: foundPlace.mapsId,
                name: req.body.places[i].name.replace("?", "s"),
                rating: req.body.places[i]["rating"],
                path: foundPlace.menu,
                photos: req.body.places[i].photos
            })
        }
    }

    res.status(200).send({ places: returnPlaces });
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

    let favorite = await Favorite.findOne({
        where: {
            Place_id: place.id,
            User_id: req.user.id
        }
    })

    if (favorite) {
        return res.status(202).send({ message: "This place is already one of your favorites" });
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

    let places = await Place.findAll({
        where: {
            id: {
                [Op.in]: favorites.map(favorite => favorite.Place_id)
            }
        }
    })

    return res.status(200).send({ places });
};


const removeFavorite = async (req, res) => {
    await Favorite.destroy({
        where: {
            Place_id: req.params.id,
            User_id: req.user.id
        }
    })

    return res.status(200).send({ message: "Deleted" });
}


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

        await user.update({
            isOwner: true
        });

        return res.status(201).send({ place: place });
    }
}


const updatePlace = async (req, res) => {
    if (!req.params.id || !req.body.mapsId || !req.body.name || !req.body.address ||
        !req.body.coordinates) {
        return req.status(400).send({ message: "Request data is malformed" });
    }

    let place = await Place.findOne({
        where: {
            id: req.params.id
        }
    });

    let filename;
    if (req.files) {
        filename = req.user.id + "_" + req.body.name.replace(" ", "").toLowerCase() + ".pdf";
        await req.files.menu.mv(CONSTANTS.FILES + "/" + filename);
    } else {
        filename = place.menu;
    }

    place = await Place.update({
        mapsId: req.body.mapsId,
        name: req.body.name,
        address: req.body.address,
        coordinates: req.body.coordinates,
        userId: req.user.id,
        menu: filename
    }, {
            where: {
                id: req.params.id
            }
        });

    return res.status(200).send({ place });
}


module.exports = {
    getPlace,
    createPlace,
    updatePlace,
    addFavoritePlace,
    getFavoritePlaces,
    findRegisteredPlaces,
    removeFavorite
}