module.exports = (sequelize, Sequelize) => {
    const User_role = sequelize.define("user_role", {
        activeStatus: {
            type: Sequelize.ENUM("Active", "Pending", "Closed"),
            defaultValue: "Active",
        }
    },
    {
        tableName: "user_roles", 
        timeStamps: true,
    });
    return User_role;
}