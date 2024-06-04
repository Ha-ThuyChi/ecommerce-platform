module.exports = (sequelize, Sequelize) => {
    const Product_property = sequelize.define("product_property", {
        
    },
    {
        tableName: "product_properties", 
        timeStamps: true,
    });
    return Product_property;
}