module.exports = (sequelize, Sequelize) => {
    const Buyer = sequelize.define("buyer", {
        name: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING,
        },
        dob: {
            type: Sequelize.DATE,
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
        },
        phone: {
            type: Sequelize.STRING,
        },
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