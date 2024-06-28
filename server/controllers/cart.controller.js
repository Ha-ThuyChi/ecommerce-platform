const db = require("../models");
const Cart_item = db.cart_item;
const Cart = db.cart;
const Product = db.product;
const Shop = db.shop;

exports.addItemToCart = async (req, res) => {
    try {
        const cartId = req.body.cartId;
        const productId = req.body.productId;
        const quantity = req.body.quantity;

        // Chech if input quantity is larger than the avai quantity
        const instockProduct = await Product.findOne({
            where: {
                id: productId,
            },
            attributes: ['quantity']
        });
        if (quantity > instockProduct.quantity) {
            res.status(400).send({success: true, message: "Available stock is less than the requested quantity."});
            return;
        };
        // Check if item exist in the cart
        const isExist = await Cart_item.findOne({
            where: {
                cartId: cartId,
                productId: productId,
            }
        });
        let isAdd;
        if (isExist == null) {
            // If not create new Cart_item
            isAdd = await Cart_item.create({
                cartId: req.body.cartId,
                productId: productId,
                quantity: quantity
            });
        } else {
            // If yes, increase the quantity
            isAdd = await Cart_item.increment("quantity", {
                by: quantity,
                where: {
                    cartId: cartId,
                    productId: productId
                }
            })
        };

        // const isDecrease = await Product.decrement("quantity", {by: quantity, where: {id: productId}});
        if (isAdd) {
            res.status(200).send({success: true, message: "Item is added to cart."});
        } else {
            res.status(400).send({success: true, message: "Fail to add item to cart."});
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({success: false, message: error.message});
    }
};

exports.deleteItemFromCart = async (req, res) => {
    try {
        const isDecrease = await Cart_item.destroy({
            where: {
                productId: req.body.productId,
                cartId: req.body.cartId,
            }
        });
        if (isDecrease) {
            res.status(200).send({success: true, message: "All items are removed from cart."});
        } else {
            res.status(400).send({success: true, message: "Fail to remove all items from cart."});
        }
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
};

exports.decreaseItemInCart = async (req, res) => {
    try {
        const [isDecrease] = await Cart_item.decrement("quantity", {
            by: 1,
            where: {
                productId: req.body.productId,
                cartId: req.body.cartId
            }
        });
        if (isDecrease[1] == 1) {
            res.status(200).send({success: true, message: "1 item is removed from cart."});
        } else {
            res.status(400).send({success: true, message: "Fail to remove 1 item from cart."});
        }
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
};

exports.viewCart = async (req, res) => {
    try {
        const cartId = await Cart.findOne({
            where: {userId: req.params.userId}
        });
        const items = await Cart_item.findAll({
            where: {
                cartId: cartId.id,
            },
            include: {
                model: Product,
                attributes: ["name", "price", "status", "description"],
                include: {
                    model: Shop,
                    attributes: ['name']
                }
            }
        });
        if (items != null) {
            res.status(200).send({success: true, message: items});
        } else {
            res.status(400).send({success: true, message: "Fail to retrieve items in this cart."});
        }
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
};

