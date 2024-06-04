module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admin", {
        name: {
            type: Sequelize.STRING,
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
    },
    {
        tableName: "admins", 
        timeStamps: true,
    });
    return Admin;
}