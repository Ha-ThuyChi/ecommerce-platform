const db = require("../models");
const Product = db.product;

exports.createProduct = async (req, res) => {
    try {
        await Product.create({
            name: req.body.name,
            price: req.body.price,
            status: req.body.status,
            shopId: req.body.shopId,
        });
        res.status(200).send({status: true, message: "Product is created."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

exports.deleteProduct = async (req, res) => {
    try {
        const isDelete = await Product.destroy({
            where: {
                id: req.params.productId,
            }
        });
        if (!isDelete) {
            res.status(404).send({status: false, message: "Product is not found."});
        }
        res.status(200).send({status: true, message: "Product is deleted."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

exports.viewProduct = async (req, res) => {
    try {
        const product = await Product.findByFk({
            id: req.params.productId,
        });
        if (product == null) {
            res.status(404).send({status: false, message: "Product is not found."});
        }
        res.status(200).send({status: true, message: product});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

exports.editProduct = async (req, res) => { 
    try {
        const isEdit = await Product.update(
            {
                name: req.body.name,
                price: req.body.price,
                status: req.body.status,
            },{
                where: {
                id: req.body.productId
            }}
        );
        if (isEdit != 0) {
            res.status(404).send({status: false, message: "Product is not found."});
        }
        res.status(200).send({status: true, message: "Product is updated."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};