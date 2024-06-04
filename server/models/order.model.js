module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("order", {
        status: {
            type: Sequelize.ENUM("Packing", "Shipping"),
            defaultValue: "Packing",
            allowNull: false,
        },
        shipTo: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        total: {
            type: Sequelize.DOUBLE,
            defaultValue: true,
        }

    },
    {
        tableName: "orders", 
        timeStamps: true,
    });
    // Shop.associate = (models) => {
    //     Seller.hasMany(models.Shop, {foreignKey: "sellerId"})
    // };
    return Order;
}