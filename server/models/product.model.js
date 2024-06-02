const Shop = require("./shop.model");

module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        status: {
            type: Sequelize.ENUM("Used", "New"),
            allowNull: false,
        }, 

    },
    {
        tableName: "products", 
        timeStamps: true,
    });
    // Product.associate = (models) => {
    //     Product.belongsTo(models.Shop, { foreignKey: 'shopId' });
    // };

    return Product;
}