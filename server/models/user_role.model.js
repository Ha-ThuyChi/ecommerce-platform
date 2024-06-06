module.exports = (sequelize, Sequelize) => {
    const User_role = sequelize.define("user_role", {
        activeStatus: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        }
    },
    {
        tableName: "user_roles", 
        timeStamps: true,
    });
    return User_role;
}