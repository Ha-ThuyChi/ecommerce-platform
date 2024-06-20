module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        status: {
            type: Sequelize.ENUM("Used", "New"),
            allowNull: false,
        }, 
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            }
        },
        description: {
            type: Sequelize.TEXT,
            defaultValue: "Description"
        }

    },
    {
        tableName: "products", 
        timeStamps: true,
    });
    return Product;
}