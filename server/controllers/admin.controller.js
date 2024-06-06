const db = require("../models");
const User = db.user;
const Role = db.role;
const User_role = db.user_role;

const { hashPassword }= require("./hashPassword");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createAdmin = (req, res) => {
    // Check if email is valid
    User.findOne({
        where: {
            email: req.body.email,
        }
    }).then((result) => {
        if (result) {
            res.status(409).send({success: false, message: "Email is existed."})
        } else { // No matched email => valid to create new account
            const password = req.body.password
            // Hashing password
            hashPassword(password).then(({hash, salt}) => {
                // Create user
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                }).then((user) => {
                    // Find id of admin in role table
                    Role.findOne({
                        where: {name: "Admin"}
                    }).then((role) => {
                        // Create user with roleId and userId
                        User_role.create({
                            userId: user.id,
                            roleId: role.id,
                        }).then(() => {
                            res.status(200).send({success: true, message: "Admin account is created."})
                        }).catch(error => {
                            res.status(500).send({success: false, message: error.message})
                        });;
                    });
                }).catch(error => {
                    res.status(500).send({success: false, message: error.message})
                }); 
            }); 
        };
    }).catch ((error) => {
        res.status(500).send({success: false, message: error.message})
    });
}

exports.signIn = (req, res) => {
    const password = req.body.password;
    Admin.findOne({
        where: {
            email: req.body.email, // check email
        }
    }).then((data) => {
        if (data) {
            // check password
            bcrypt.compare(password, data.password, function (err, result) {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return;
                }
                if (result) {
                    const token = jwt.sign(
                        {data}, 
                        process.env.JWT_SECRET, 
                        // {expiresIn: '1h'}
                    );
                    res.status(200).send({success: true, message: {accessToken: token, message: data.id}});
                } else {
                    res.status(400).send({success: false, message: "Invalid password."});
                }
            });
        } else {
            res.status(400).send({success: false, message: "Invalid username."});
        }
    }).catch(error => {
        res.status(500).send({success: false, message: error.message});
    })
};

// Disable/Enable seller account
exports.editStatusSellerAccount = (req, res) => {
    User_role.update({
        activeStatus: req.body.activeStatus,
    }, {
        where: { 
            userId: req.body.userId,
        }
    }).then(() => {
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
    }).then(() => {
        res.status(200).send({success: true, message: "Status of user account is edited."})
    }).catch(error => {
        res.status(500).send({success: false, message: error.message})
    }) 
};

