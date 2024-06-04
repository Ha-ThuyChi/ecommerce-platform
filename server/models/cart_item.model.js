module.exports = (sequelize, Sequelize) => {
    const Cart_item = sequelize.define("cart_item", {
        quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
    },
    {
        tableName: "cart_items", 
        timeStamps: true,
    });
    return Cart_item;
}