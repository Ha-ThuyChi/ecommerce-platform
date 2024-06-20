const db = require("../models");
const User = db.user;
const Role = db.role;
const Shop = db.shop;
const User_role = db.user_role;

exports.assignAdminRole = async (req, res) => {
    try {
        const role = await Role.findOne({
            where: {
                name: "Admin"
            }
        });
        const isAssigned = await User_role.create({
            activeStatus: "Active",
            userId: req.body.userId,
            roleId: role.id
        });
        if (isAssigned != 1) {
            res.status(400).send({success: true, message: "Fail to assign a new admin."});
            return;
        };
        res.status(200).send({status: true, message: "Admin is assigned"});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

// Disable/Enable seller account
exports.editStatusSellerAccount = (req, res) => {
    User_role.update({
        activeStatus: req.body.activeStatus,
    }, {
        where: { 
            userId: req.body.userId,
        }
    }).then((data) => {
        if (data == 0) {
            res.status(401).send({success: false, message: "No seller account is valid to edit."});
            return;
        };
        res.status(200).send({success: true, message: "Status of seller account is edited."})
    }).catch(error => {
        res.status(500).send({success: false, message: error.message})
    }) 
}

// Disable/Enable user account
exports.editStatusUserAccount = (req, res) => {
    User.update({
        activeStatus: req.body.activeStatus,
    }, {
        where: { 
            id: req.body.userId,
        }
    }).then((data) => {
        if (data == 0) {
            res.status(401).send({success: false, message: "No user account is valid to edit."});
            return;
        };
        res.status(200).send({success: true, message: "Status of user account is edited."})
    }).catch(error => {
        res.status(500).send({success: false, message: error.message})
    }) 
};

// Disable/Enable shop
exports.editStatusShop = (req, res) => {
    Shop.update({
        activeStatus: req.body.activeStatus,
    }, {
        where: { 
            id: req.body.id,
        }
    }).then((data) => {
        if (data == 0) {
            res.status(401).send({success: false, message: "No shop is valid to edit."});
            return;
        };
        res.status(200).send({success: true, message: "Status of shop is edited."})
    }).catch(error => {
        res.status(500).send({success: false, message: error.message})
    }) 
};