const Place = (sequelize, dataTypes) => {
    return sequelize.define("place", {
        mapsId: dataTypes.STRING,
        name: dataTypes.STRING,
        address: dataTypes.STRING,
        coordinates: dataTypes.STRING,
        menu: dataTypes.STRING
    }, {
            timestamps: false
        })
}

module.exports = Place;