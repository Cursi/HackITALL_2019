const Credential = (sequelize, dataTypes) => {
    return sequelize.define("credential", {
        endpoint: dataTypes.STRING,
        p256: dataTypes.STRING,
        auth: dataTypes.STRING,
    }, {
        timestamps: false
    })
}

module.exports = Credential;