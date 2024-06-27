module.exports = (sequelize, Sequelize) => {
    const Order_item = sequelize.define("order_item", {
        quantity: {
            type: Sequelize.INTEGER,
        }
    },
    {
        tableName: "order_items", 
        timeStamps: true,
    });
    return Order_item;
}