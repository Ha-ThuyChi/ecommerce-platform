const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize(
    "ecommerce_platform",
    "root",
    "root", 
    {
        dialect: "mysql",
        host: "localhost",
    },
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.seller = require("./seller.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.shop = require("./shop.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.buyer = require("./buyer.model.js")(sequelize, Sequelize);
db.cart = require("./cart.model.js")(sequelize, Sequelize);
db.cart_item = require("./cart_item.model.js")(sequelize, Sequelize);
db.promotion = require("./promotion.model.js")(sequelize, Sequelize);
db.admin = require("./admin.model.js")(sequelize, Sequelize);
db.property = require("./property.model.js")(sequelize, Sequelize);
db.product_property = require("./product_property.model.js")(sequelize, Sequelize);

module.exports = db;