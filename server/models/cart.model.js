module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define("cart", {
        
    },
    {
        tableName: "carts", 
        timeStamps: true,
    });
    return Cart;
}