module.exports = (sequelize, Sequelize) => {
    const Property = sequelize.define("property", {
        name: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        }
    },
    {
        tableName: "properties", 
        timeStamps: true,
    });
    return Property;
}