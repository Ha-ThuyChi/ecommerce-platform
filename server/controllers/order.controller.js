const db = require("../models");
const Order = db.order;
const Product = db.product;
const Order_item = db.order_item;
const Cart_item = db.cart_item;
const Cart = db.cart;


async function restuctureOrderItems(items) {
    try {
        let newOrderItems = [];
        for (const item of items) {
            const product = await Product.findOne({where:{id: item.productId}, attributes: ["shopId"]});
            const order = newOrderItems.find(order => order.shopId == product.shopId);
            if (order) {
                order.items.push(item);
            } else {
                console.log(item)
                newOrderItems.push({shopId: product.shopId, items: [item]});
            }
        };
        return newOrderItems;
    } catch (error) {
       console.error(`Error while restructuring the order items: ${error.message}`);
    }
}

// input: userId, shipto, orderItems[{productId: 1, quantity: 1},...]
exports.createOrder = async (req, res) => {
    try {
        let total = 0;
        let newOrders = [], index = 0;
        const items = req.body.orderItems
        const orderItems = await restuctureOrderItems(items);
        const cart = await Cart.findOne({where: {userId: req.body.userId}})
        console.log(items)
        for (const orderItem of orderItems) {
            console.log(orderItem)
            // Decrease the quantity of product
            const items = orderItem.items;
            for (const item of items) {
                const product = await Product.findOne({
                    where: {id: item.productId},
                    attributes: ["price", "quantity", "name", "shopId"]
                });
                // Check if requested quantity is valid
                if (item.quantity > product.quantity) {
                    res.status(400).send({success: false, message: `Quantity of item ${product.name} is not valid.`});
                    return;
                };

                // Calculate the total of the order
                total = total + (product.price*item.quantity);
                // Decrease quantity of product in the stock
                await Product.decrement("quantity", {
                    by: item.quantity,
                    where: {
                        id: item.productId
                    }
                });
            };
            // Create a new order
            newOrders[index] = await Order.create({
                status: "Packing",
                shipTo: req.body.shipTo,
                total: total,
                userId: req.body.userId,
                shopId: orderItem.shopId,
            });
            for (const item of items) {
                await Order_item.create({
                    quantity: item.quantity,
                    orderId: newOrders[index].id,
                    productId: item.productId
                });
                await Cart_item.destroy({
                    where: {
                        productId: item.productId,
                        cartId: cart.id,
                    }
                });
            }
            index++;
        };
        if (newOrders) {
            res.status(200).send({success: true, message: "Order is created."});
        } else {
            res.status(400).send({success: true, message: `Fail to create a new order.}`});
            return;
        };
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
};

// input: orderId, status ("Packing", "Shipping", "Completed", "Cancelled")
exports.updateStatus = async (req, res) => {
    try {
        const status = req.body.status;
        const orderId = req.body.orderId;
        // Find all the products in the order
        const products= await Order_item.findAll({
            where: {
                orderId: orderId,
            },
            attributes: ["productId"]
        });
        // Update the sold number and stock number of each product
        let isUpdated;
        if (status == "Completed") {
            isUpdated = products.map( async (item) => {
                const orderItem = await Order_item.findOne({
                    where: {
                        orderId: orderId, 
                        productId: item.productId
                    },
                    attributes: ["quantity"]
                });
                await Product.increment("sold", {
                    by: orderItem.quantity,
                    where: {
                        id: item.productId
                    }
                });
            });
        };
        console.log(isUpdated)
        const isUpdateStatus = await Order.update({
            status: status
        },
        {
            where: {
                id: req.body.orderId,
            }
        });
        if (isUpdateStatus != 1) {
            res.status(404).send({status: false, message: "Order is not found."});
            return;
        }
        res.status(200).send({success: true, message: "Order's status is updated."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
};

