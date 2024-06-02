const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    "ecommerce_platform",
    "root",
    "root", 
    {
        dialect: "mysql",
        host: "localhost",
    }
);



const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.seller = require("./seller.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.shop = require("./shop.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.buyer = require("./buyer.model.js")(sequelize, Sequelize);

module.exports = db;