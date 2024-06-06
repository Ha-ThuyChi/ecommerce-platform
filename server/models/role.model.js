
module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },

    },
    {
        tableName: "roles", 
        timeStamps: true,
    });
    return Role;
}