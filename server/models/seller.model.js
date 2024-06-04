module.exports = (sequelize, Sequelize) => {
    const Seller = sequelize.define("seller", {
        activeStatus: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "sellers", 
        timeStamps: true,
    });
    return Seller;
}