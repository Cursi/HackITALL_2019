const Offer = (sequelize, dataTypes) => {
    return sequelize.define("offer", {
        offer: dataTypes.STRING
    }, {
            timestamps: false
        })
}

module.exports = Offer;