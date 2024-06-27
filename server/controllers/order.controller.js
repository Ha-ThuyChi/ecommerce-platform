const Order = require("../models").order;
const Product = require("../models").product;
const Order_item = require("../models").order_item;

// input: userId, shopId, total, shipto, orderItems[quantity, productId]
exports.createOrder = async (req, res) => {
    try {
        // Calculate the total of the order and check if the requested quantity is valid
        let total = 0;
        const orderItems = req.body.orderItems;
        for (const orderItem of orderItems) {
            const item = await Product.findOne({
                where: {id: orderItem.productId},
                attributes: ["price", "quantity", "name"]
            });
            
            if (orderItem.quantity > item.quantity) {
                res.status(400).send({success: true, message:  `Available stock of ${item.name} is less than the requested quantity.`});
                return;
            }
            total = total + (item.price*orderItem.quantity);
        };
        // Create a new order
        const newOrder = await Order.create({
            status: "Packing",
            shipTo: req.body.shipTo,
            total: total,
            userId: req.body.userId,
            shopId: req.body.shopId,
        });
        // Create new order_item to save the items in the cart
        const newOrderItem = orderItems.map(async (item) => 
            await Order_item.create({
                quantity: item.quantity,
                orderId: newOrder.id,
                productId: item.productId
            }
        ));
        if (newOrder && newOrderItem) {
            res.status(200).send({success: true, message: "Order is created."});
        } else {
            res.status(400).send({success: true, message: "Fail to create a new order."});
        }
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
                await Product.decrement("quantity", {
                    by: orderItem.quantity,
                    where: {
                        id: item.productId
                    }
                });
            })
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
        res.status(200).send({status: true, message: "Order's status is updated."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
};

