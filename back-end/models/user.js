const User = (sequelize, dataTypes) => {
    return sequelize.define("user", {
        email: dataTypes.STRING,
        firstname: dataTypes.STRING,
        lastname: dataTypes.STRING,
        photo: dataTypes.STRING,
        isOwner: {
            type: dataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: false
    })
}

module.exports = User;