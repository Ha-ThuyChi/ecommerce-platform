require("dotenv").config();
const mysql = require("mysql2/promise");
const Sequelize = require("sequelize");

const db = require("./models");
const Seller = db.seller;
const Product = db.product;
const Shop = db.shop;
const Order = db.order;
const Buyer = db.buyer;

// Association
Seller.hasMany(Shop, {
    foreignKey: {
      name: "shopId",
      allowNull: false,
    },
});
Shop.belongsTo(Seller, {
    foreignKey: {
      name: "shopId",
      allowNull: false,
    },
});
Shop.hasMany(Product, {
    foreignKey: {
        name: "shopId",
        allowNull: false,
    }
});
Product.belongsTo(Shop, {
    foreignKey: {
      name: "shopId",
      allowNull: false,
    },
});
Buyer.hasMany(Order, {
  foreignKey: {
    name: "buyerId",
    allowNull: false,
  }
});
Order.belongsTo(Buyer, {
  foreignKey: {
    name: "buyerId",
    allowNull: false,
  }
});
Shop.hasMany(Order, {
  foreignKey: {
    name: "shopId",
    allowNull: false,
  }
});
Order.belongsTo(Shop, {
  foreignKey: {
    name: "shopId",
    allowNull: false,
  }
})

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
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // drop all the created database
    await db.sequelize.drop();

    // init models and add them to the exported db object
    await Seller.sync({alert: true});
    await Buyer.sync({alert: true});
    await Shop.sync({alert:true});
    await Product.sync({alert:true});
    await Order.sync({alert: true});

    console.log("Finish initialize database.")
  }
  syncModel();
  