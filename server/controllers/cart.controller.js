const db = require("../models");
const Cart_item = db.cart_item;
const Cart = db.cart;
const Product = db.product;
const Shop = db.shop;

// input: userId, productId, quanitty
exports.addItemToCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        const cart = await Cart.findOne({
            where: {userId: userId}
        });
        const cartId = cart.id;
        console.log(cartId);
        // Check if item exist in the cart
        const cartItem = await Cart_item.findOne({
            where: {
                cartId: cartId,
                productId: productId,
            }
        });
        console.log(cartItem)
        // Chech if input quantity is larger than the avai quantity
        const instockProduct = await Product.findOne({
            where: {
                id: productId,
            },
            attributes: ['quantity']
        });
        if (quantity > instockProduct.quantity) {
            res.status(400).send({success: false, message: "Available stock is less than the requested quantity."});
            return;
        };
        let isAdd;
        if (cartItem == null) {
            // If not create new Cart_item
            isAdd = await Cart_item.create({
                cartId: cartId,
                productId: productId,
                quantity: quantity
            });
        } else {
            // If yes, check the new quantity then increase the quantity
            if (Number(quantity) + cartItem.quantity > instockProduct.quantity) {
                res.status(400).send({success: false, message: "Available stock is less than your requested quantity and quantity in the cart."});
                return;
            }
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
            res.status(200).send({success: true, message: "Item is removed from cart."});
        } else {
            res.status(400).send({success: true, message: "Fail to remove item from cart."});
        }
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
};

// input: productId, cartId, action
exports.updateQuantity = async (req, res) => {
    try {
        const action = req.body.action;
        let isUpdated;
        if (action === "decrease") {
            [isUpdated] = await Cart_item.decrement("quantity", {
                by: 1,
                where: {
                    productId: req.body.productId,
                    cartId: req.body.cartId
                }
            });
        } else {
            [isUpdated] = await Cart_item.increment("quantity", {
                by: 1,
                where: {
                    productId: req.body.productId,
                    cartId: req.body.cartId
                }
            });
        };
        if (isUpdated[1] == 1) {
            res.status(200).send({success: true, message: "Quantity is updated."});
        } else {
            res.status(400).send({success: true, message: "Fail to update the quantity in the cart."});
        }
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
};

exports.viewCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            where: {userId: req.params.userId}
        });
        const items = await Cart_item.findAll({
            order: [ // get the favourite items first
                ["isFavourite", "DESC"]
            ],
            where: {
                cartId: cart.id,
            },
            include: {
                model: Product,
                attributes: ["name", "price", "status", "description", "id", "image"],
                include: {
                    model: Shop,
                    attributes: ['name', "id"]
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

// input: productId, cartId, isFavourite
exports.updateFavourite = async (req, res) => {
    try {
        const isUpdated = await Cart_item.update({
            isFavourite: req.body.isFavourite
        },
        {
            where: {
                productId: req.body.productId,
                cartId: req.body.cartId
            }
        });
        if (isUpdated != 1) {
            res.status(404).send({success: false, message: "Item is not found."});
            return;
        };
        res.status(200).send({success: true, message: "Item is updated."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}