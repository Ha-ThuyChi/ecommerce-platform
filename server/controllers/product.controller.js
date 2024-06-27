const db = require("../models");
const Product = db.product;
const Shop = db.shop;

exports.createProduct = async (req, res) => {
    try {
        await Product.create({
            name: req.body.name,
            price: req.body.price,
            status: req.body.status,
            shopId: req.body.shopId,
            quantity: req.body.quantity,
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
            return;
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
            return;
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
                quantity: req.body.quantity,
            },{
                where: {
                id: req.body.productId
            }}
        );
        if (isEdit != 0) {
            res.status(404).send({status: false, message: "Product is not found."});
            return;
        }
        res.status(200).send({status: true, message: "Product is updated."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

exports.getSomeProducts = async (req, res) => {
    try {
        const listProducts = await Product.findAll({
            order: [
                ["createdAt", "ASC"]
            ],
            offset: (req.params.pageNum - 1) * 5,
            limit: 5,
            include: {
                model: Shop,
                attributes: ["name"]
            }
        });
        if (listProducts == null) {
            res.status(404).send({status: false, message: "No product is found."});
            return;
        }
        res.status(200).send({status: true, message: listProducts});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
};

// exports.updateSold = async (req, res) => {

// }