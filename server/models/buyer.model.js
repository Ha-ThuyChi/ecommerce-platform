module.exports = (sequelize, Sequelize) => {
    const Buyer = sequelize.define("buyer", {
        activeStatus: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "buyers", 
        timeStamps: true,
    });
    return Buyer;
}