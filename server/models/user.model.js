module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        name: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING,
        },
        dob: {
            type: Sequelize.DATE,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        phone: {
            type: Sequelize.STRING,
        },
        activeStatus: {
            type: Sequelize.ENUM("Active", "Pending", "Closed"),
            defaultValue: "Active",
        },
    },
    {
        tableName: "users", 
        timeStamps: true,
    });
    return User;
}