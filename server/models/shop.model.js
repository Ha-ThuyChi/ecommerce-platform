const Seller = require("./seller.model");

module.exports = (sequelize, Sequelize) => {
    const Shop = sequelize.define("shop", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        activeStatus: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        }

    },
    {
        tableName: "shops", 
        timeStamps: true,
    });
    // Shop.associate = (models) => {
    //     Seller.hasMany(models.Shop, {foreignKey: "sellerId"})
    // };
    return Shop;
}