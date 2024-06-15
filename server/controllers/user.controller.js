const db = require("../models");
const User = db.user;
const Role = db.role;
const User_role = db.user_role;
const Cart = db.cart;
const { hashPassword } = require("./hashPassword");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
    try {
        // Check if input email is existed
        const email = await  User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (email) {
            res.status(409).send({success: false, message: "email is existed."})
            return;
        };
        // Email is valid to create new user account, buyer account and cart
        const password = req.body.password;
        const hashedPassword = await hashPassword(password);
        // User account
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            dob: req.body.dob,
            password: hashedPassword,
            address: req.body.address,
            phone: req.body.phone
        });
        // Buyer account
        const role = await Role.findOne({where: {name: "Buyer"}});  // Find buyer role
        const newUserRole = await User_role.create({
            userId: newUser.id,
            roleId: role.id,
        })
        // Cart
        const newCart = await Cart.create({
            userId: newUser.id,
        });
        if (newUser && newUserRole && newCart) {
            res.status(200).send({success: true, message: "User account is created."});
        } else {
            res.status(400).send({success: true, message: "Fail to create a new account."});
        }
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

exports.signIn = async (req, res) => {
    const password = req.body.password;
    try {
        // Find matched email
        const user = await User.findOne({
            where: {
                email: req.body.email, 
            }
        });
        if (user == null) {
            res.status(400).send({success: false, message: "Invalid email."});
            return;
        }
        if (user.activeStatus != ("Active")) { // Check id account is enable
            return res.status(400).send({success: false, message: "Account is disable."});
        }
        // Check if password is matched
        try {
            const isValidPwd = await bcrypt.compare(password, user.password);
            if (!isValidPwd) {
                res.status(400).send({success: false, message: "Invalid password."});
                return;
            }
        } catch (error) {
            console.error('Error comparing passwords:', error);
            return;
        }
        // Create token
        const token = jwt.sign(
            {user}, 
            process.env.JWT_SECRET, 
            // {expiresIn: '1h'}
        );
        res.status(200).send({success: true, message: {accessToken: token, message: user.id}});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

exports.createSellerAccount = async (req, res) => {
    try {
        const role = await Role.findOne({where: {name: "Seller"}});  // Find seller role
        const user = await User_role.create({
            userId: req.body.userId,
            roleId: role.id,
        });
        if (user == 0) {
            res.status(403).send({success: false, message: "Seller account exist."});
            return;
        }
        res.status(200).send({success: true, message: "Seller account is created."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

exports.viewUser = async (req, res) => {
    try {
        const user = await User.findOne({
            id: req.params.userId,
        });
        if (user == null) {
            res.status(404).send({status: false, message: "User is not found."});
            return;
        }
        res.status(200).send({status: true, message: user});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

exports.editUser = async (req, res) => { 
    try {
        // Check if input email is existed
        const email = await  User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (email) {
            res.status(409).send({success: false, message: "email is existed."})
            return;
        };
        const isEdit = await User.update(
            {
                name: req.body.name,
                email: req.body.email,
                dob: req.body.dob,
                address: req.body.address,
                phone: req.body.phone
            },{
                where: {
                    id: req.body.userId
            }}
        );
        if (isEdit != 1) {
            res.status(404).send({status: false, message: "User is not found."});
            return;
        }
        res.status(200).send({status: true, message: "User is updated."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

exports.deleteUser = async (req, res) => {
    try {
        const isDelete = await User.update({
            activeStatus: "Closed",
        }, {
            where: {
                id: req.params.userId,
            }
        });
        if (isDelete != 1) {
            res.status(404).send({success: false, message: "No user is delete."});
            return;
        }
        res.status(200).send({status: true, message: "User is deleted."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};