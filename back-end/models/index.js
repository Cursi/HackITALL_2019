
const sequelize = require('./db');
const User = sequelize.import('./user');
const Place = sequelize.import("./place");
const Credential = sequelize.import('./credential');
const Favorite = sequelize.define("favorite", {});
const History = sequelize.define("history", {});

User.belongsToMany(Place, {through: Favorite, foreignKey: "User_id"});
Place.belongsToMany(User,  {through: Favorite, foreignKey: "Place_id"})

User.belongsToMany(Place, {through: History, foreignKey: "User_id"});
Place.belongsToMany(User,  {through: History, foreignKey: "Place_id"})

Place.belongsTo(User);
Credential.belongsTo(User);

module.exports = {
    sequelize,
    User,
    Place,
    Credential,
    Favorite,
    History
}