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
    return Shop;
}