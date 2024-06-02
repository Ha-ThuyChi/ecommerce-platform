module.exports = (sequelize, Sequelize) => {
    const Seller = sequelize.define("seller", {
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
        tableName: "sellers", 
        timeStamps: true,
    });
    return Seller;
}