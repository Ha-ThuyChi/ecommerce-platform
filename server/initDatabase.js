require("dotenv").config();
const mysql = require("mysql2/promise");
const { hashPassword } = require("./controllers/hashPassword");

const db = require("./models");
const Product = db.product;
const Shop = db.shop;
const Order = db.order;
const Cart = db.cart;
const Cart_item = db.cart_item;
const Promotion = db.promotion;
const Property = db.property;
const Product_property = db.product_property;
const User = db.user;
const Role = db.role;
const User_role = db.user_role;

// Association
User.hasMany(Shop);
User.hasMany(Order);
User.hasOne(Cart);
Shop.hasMany(Product);
Shop.hasMany(Order);

Cart.belongsToMany(Product, { through: Cart_item });
Product.belongsToMany(Cart, { through: Cart_item });

Product.belongsToMany(Property, {through: Product_property});
Property.belongsToMany(Product, {through: Product_property});

User.belongsToMany(Role, { through: User_role });
Role.belongsToMany(User, { through: User_role });


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
    await User.sync({alert:true, logging: false});
    await Shop.sync({alert:true, logging: false});
    await Product.sync({alert:true, logging: false});
    await Order.sync({alert: true, logging: false});
    await Cart.sync({alert: true, logging: false});
    await Cart_item.sync({alert: true, logging: false});
    await Promotion.sync({alert: true, logging: false});
    await Property.sync({alert:true, logging: false});
    await Product_property.sync({alert:true, logging: false});
    await Role.sync({alert:true, logging: false});
    await User_role.sync({alert:true, logging: false});

    // Add roles
    await Role.create({
        name: "Admin",
    });
    await Role.create({
        name: "Seller",
    });
    await Role.create({
        name: "Buyer",
    });

    // for testing
    const pwd = await hashPassword("password");
    User.create({
        name: "user1",
        password: pwd,
        dob: "01-01-2001",
        email: "user2@gmail.com"
    });
    Shop.create({
        name: "ChiChi Shop",
        address: "Hanoi",
        activeStatus: "Active",
        userId: 1,
    });
    await User_role.create({
        userId: 1,
        roleId: 2
    })

    

    console.log("Finish initialize database.")
}

module.exports = {syncModel};
