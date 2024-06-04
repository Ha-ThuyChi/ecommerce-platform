module.exports = (sequelize, Sequelize) => {
    const Promotion = sequelize.define("promotion", {
        code: {
            type: Sequelize.STRING,
        },
        percentage: {
            type: Sequelize.FLOAT,
        },
        expireDate: {
            type: Sequelize.DATE,
        }
    },
    {
        tableName: "promotions", 
        timeStamps: true,
    });
    return Promotion;
}