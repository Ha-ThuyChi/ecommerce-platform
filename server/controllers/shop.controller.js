const db = require("../models");
const Shop = db.shop;

exports.createShop = (req, res) => {
    Shop.create({
        name: req.body.name,
        address: req.body.address,
        activeStatus: "Active",
        userId: req.body.userId,
    }).then(() => {
        res.status(200).send({success: true, message: "Your shop is created."});
    }).catch(error => {
        res.status(500).send({success: false, message: error.message})
    });
};

exports.viewShop = async (req, res) => {
   try {
        const shop = await Shop.findOne({
            where: {
                id: req.params.shopId,
            }
        });
        if (shop == null) {
            res.status(404).send({success: false, message: "No shop is matched."});
            return;
        } else if (shop.activeStatus != ("Active")) {
            res.status(403).send({success: false, message: "Shop is disable."});
            return;
        }
        res.status(200).send({success: true, message: shop});
   } catch (error) {
        res.status(500).send({success: false, message: error.message})
   }
};

exports.editShop = async (req, res) => {
   try {
        const isEdit = await Shop.update({
            name: req.body.name,
            address: req.body.address,
            activeStatus: req.body.activeStatus,
        },{
            where: {
                id: req.body.shopId,
            }
        });
        if (isEdit != 1) {
            res.status(404).send({success: false, message: "No shop is edited."});
            return;
        };
        res.status(200).send({success: true, message: "Shop is edited."});
   } catch (error) {
        res.status(500).send({success: false, message: error.message})
   }
};

exports.requestToCloseShop = async (req, res) => {
    try {
        const isEdit = await Shop.update({
            activeStatus: "Pending",
        },{
        where: {
            id: req.params.shopId,
        }
        });
        if (isEdit != 1) {
            res.status(404).send({success: false, message: "No shop is closed."});
            return;
        };
        res.status(200).send({success: true, message: "Shop is pending to close."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message})
    }
};

exports.deleteShop = async (req, res) => {
    try {
        const isDelete = await Shop.destroy({
            where: {
                id: req.params.shopId,
            }
        });
        if (!isDelete) {
            res.status(404).send({status: false, message: "Shop is not found."});
            return;
        }
        res.status(200).send({status: true, message: "Shop is deleted."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};