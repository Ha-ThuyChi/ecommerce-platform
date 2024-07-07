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
const Order_item = db.order_item;

// Association
User.hasMany(Shop, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});
Shop.belongsTo(User, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});
User.hasMany(Order, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});
Order.belongsTo(User, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});
User.hasOne(Cart);
Shop.hasMany(Product, {
    foreignKey: {
        name: "shopId",
        allowNull: false,
    },
});
Product.belongsTo(Shop, {
    foreignKey: {
        name: "shopId",
        allowNull: false,
    },
});
Shop.hasMany(Order, {
    foreignKey: {
        name: "shopId",
        allowNull: false,
    },
});
Order.belongsTo(Shop, {
    foreignKey: {
        name: "shopId",
        allowNull: false,
    },
})
// Cart.belongsToMany(Product, { through: Cart_item });
// Product.belongsToMany(Cart, { through: Cart_item });
Cart.hasMany(Cart_item, {
    foreignKey: {
        name: "cartId",
        allowNull: false,
    },
});
Cart_item.belongsTo(Cart, {
    foreignKey: {
        name: "cartId",
        allowNull: false,
    },
});
Product.hasMany(Cart_item, {
    foreignKey: {
        name: "productId",
        allowNull: false,
    },
});
Cart_item.belongsTo(Product, {
    foreignKey: {
        name: "productId",
        allowNull: false,
    },
});

Order.hasMany(Order_item, {
    foreignKey: {
        name: "orderId",
        allowNull: false,
    },
});
Order_item.belongsTo(Order, {
    foreignKey: {
        name: "orderId",
        allowNull: false,
    },
});
Product.hasMany(Order_item, {
    foreignKey: {
        name: "productId",
        allowNull: false,
    },
});
Order_item.belongsTo(Product, {
    foreignKey: {
        name: "productId",
        allowNull: false,
    },
});

Product.belongsToMany(Property, {through: Product_property});
Property.belongsToMany(Product, {through: Product_property});

User.hasMany(User_role, { 
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});
User_role.belongsTo(User, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});
Role.hasMany(User_role, { 
    foreignKey: {
        name: "roleId",
        allowNull: false,
    },
});
User_role.belongsTo(Role, {
    foreignKey: {
        name: "roleId",
        allowNull: false,
    },
});


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
    await Order_item.sync({alert:true, logging: false});

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
    await User.create({
        name: "user1",
        password: pwd,
        dob: "01-01-2001",
        email: "user1@gmail.com"
    });
    await User.create({
        name: "user2",
        password: pwd,
        dob: "01-01-2001",
        email: "user2@gmail.com"
    });
    await User.create({
        name: "user3",
        password: pwd,
        dob: "01-01-2001",
        email: "user3@gmail.com"
    });
    await Shop.create({
        name: "ChiChi Shop",
        address: "Hanoi",
        activeStatus: "Active",
        userId: 3,
    });
    await Shop.create({
        name: "Shop Shop",
        address: "Hanoi",
        activeStatus: "Active",
        userId: 3,
    });
    await Product.create({
        name: "Manga",
        price: 100000,
        quantity: 100,
        status: "New",
        shopId: 2,
        createdAt: "2023-01-01",
        image: "https://th.bing.com/th/id/R.c38fe4763f73923ab3a9beb5cc2af370?rik=KlXLLrBiBwl87w&pid=ImgRaw&r=0"
    });
    await Product.create({
        name: "Figure1",
        price: 200000,
        quantity: 20,
        status: "Used",
        shopId: 1,
        createdAt: "2022-01-01",
        image: "https://th.bing.com/th/id/R.c38fe4763f73923ab3a9beb5cc2af370?rik=KlXLLrBiBwl87w&pid=ImgRaw&r=0"
    });
    await Product.bulkCreate([
        {
            name: "Figure2",
            price: 200000,
            quantity: 20,
            status: "Used",
            shopId: 1,
            createdAt: "2021-01-01",
            image: "https://th.bing.com/th/id/R.c38fe4763f73923ab3a9beb5cc2af370?rik=KlXLLrBiBwl87w&pid=ImgRaw&r=0"
        },
        {
            name: "Figure3",
            price: 200000,
            quantity: 20,
            status: "Used",
            shopId: 1,
            createdAt: "2010-01-01",
            image: "https://th.bing.com/th/id/R.c38fe4763f73923ab3a9beb5cc2af370?rik=KlXLLrBiBwl87w&pid=ImgRaw&r=0"
        },
        {
            name: "Figure4",
            price: 200000,
            quantity: 20,
            status: "Used",
            shopId: 1,
            image: "https://th.bing.com/th/id/R.c38fe4763f73923ab3a9beb5cc2af370?rik=KlXLLrBiBwl87w&pid=ImgRaw&r=0"
        },
        {
            name: "Figure5",
            price: 200000,
            quantity: 20,
            status: "Used",
            shopId: 1,
            image: "https://th.bing.com/th/id/R.c38fe4763f73923ab3a9beb5cc2af370?rik=KlXLLrBiBwl87w&pid=ImgRaw&r=0"
        },
        {
            name: "Figure6",
            price: 200000,
            quantity: 20,
            status: "Used",
            shopId: 1,
            image: "https://th.bing.com/th/id/R.c38fe4763f73923ab3a9beb5cc2af370?rik=KlXLLrBiBwl87w&pid=ImgRaw&r=0"
        },
        {
            name: "Figure7",
            price: 200000,
            quantity: 20,
            status: "Used",
            shopId: 1,
            image: "https://th.bing.com/th/id/R.c38fe4763f73923ab3a9beb5cc2af370?rik=KlXLLrBiBwl87w&pid=ImgRaw&r=0"
        }
    ]);
    // user1: Admin
    // user2: Buyer
    // user3: Buyer, Seller
    await User_role.create({
        userId: 1,
        roleId: 1
    });
    await User_role.create({
        userId: 2,
        roleId: 3
    });
    await User_role.create({
        userId: 3,
        roleId: 2
    });
    await User_role.create({
        userId: 3,
        roleId: 3
    });
    await Cart.create({
        userId: 3,
    });
    await Cart.create({
        userId: 2,
    });
    await Cart_item.create({
        cartId: 1,
        productId: 2,
        quantity: 10
    });
    await Cart_item.create({
        cartId: 1,
        productId: 1,
        quantity: 10
    });
    await Cart_item.create({
        cartId: 2,
        productId: 2,
        quantity: 10
    });
    // await Order.create({
    //     shipTo: "address1",
    //     total: 1500000,
    //     userId: 2,
    //     shopId: 1
    // });
    // await Order_item.create({
    //     quantity: 5,
    //     orderId: 1,
    //     productId: 1
    // });
    // await Order_item.create({
    //     quantity: 5,
    //     orderId: 1,
    //     productId: 2
    // })

    

    console.log("Finish initialize database.")
}

module.exports = {syncModel};
