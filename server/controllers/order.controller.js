const Order = require("../models").order;

exports.createOrder = async (req, res) => {
    try {
        const newOrder = await Order.create({
            status: "Packing",
            shipTo: req.body.shipTo,
            total: req.body.total,
            userId: req.body.userId,
            shopId: req.body.shopId,
        });
        if (newOrder) {
            res.status(200).send({success: true, message: "Order is created."});
        } else {
            res.status(400).send({success: true, message: "Fail to create a new order."});
        }
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
};
exports.updateStatus = async (req, res) => {
    try {
        const isUpdate = await Order.update({
            status: req.body.status,
        },
        {
            where: {
                id: req.body.orderId,
            }
        });
        if (isUpdate != 1) {
            res.status(404).send({status: false, message: "Order is not found."});
            return;
        }
        res.status(200).send({status: true, message: "Order's status is updated."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
};

