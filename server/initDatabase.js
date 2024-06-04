require("dotenv").config();
const mysql = require("mysql2/promise");
const Sequelize = require("sequelize");

const db = require("./models");
const Seller = db.seller;
const Product = db.product;
const Shop = db.shop;
const Order = db.order;
const Buyer = db.buyer;
const Cart = db.cart;
const Cart_item = db.cart_item;
const Promotion = db.promotion;
const Admin = db.admin;
const Property = db.property;
const Product_property = db.product_property;

// Association
Seller.hasMany(Shop);
Shop.hasMany(Product);
Buyer.hasMany(Order);
Shop.hasMany(Order);
Buyer.hasOne(Cart);
Cart.hasMany(Cart_item);
Product.hasMany(Cart_item);
Product.hasMany(Product_property);
Property.hasMany(Product_property);



// Connect to database
async function syncModel() {
    console.log("Start creating database...")
    // create db if it doesn't already exist
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASS;
    const database = process.env.DB_DATABASE;

    const connection = await mysql.createConnection({ 
        host: host, 
        user: user,
        password: password
    },{logging: false});
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // drop all the created database
    await db.sequelize.drop({logging: false});

    // init models and add them to the exported db object
    await Seller.sync({alert: true, logging: false});
    await Buyer.sync({alert: true, logging: false});
    await Shop.sync({alert:true, logging: false});
    await Product.sync({alert:true, logging: false});
    await Order.sync({alert: true, logging: false});
    await Cart.sync({alert: true, logging: false});
    await Cart_item.sync({alert: true, logging: false});
    await Promotion.sync({alert: true, logging: false});
    await Admin.sync({alert: true, logging: false});
    await Property.sync({alert:true, logging: false});
    await Product_property.sync({alert:true, logging: false, logging: false});

    Admin.create({
        name: "admin1",
        username: "admin1",
        password: "$2b$10$/j0L1gbBUDzdu3XsxHPIBOCpyP/hDMwFig8FSNAfh2WXVXZzIi3ba"
    })

    console.log("Finish initialize database.")
}

module.exports = {syncModel};
