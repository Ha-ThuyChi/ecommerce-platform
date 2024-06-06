const db = require("../models");
const Shop = db.shop;


exports.createShop = (req, res) => {
    Shop.create({
        name: req.body.name,
        address: req.body.address,
        activeStatus: true,
        userId: req.body.userId,
    }).then(() => {
        res.status(200).send({success: true, message: "Your shop is created."});
    }).catch(error => {
        res.status(500).send({success: false, message: error.message})
    });
}