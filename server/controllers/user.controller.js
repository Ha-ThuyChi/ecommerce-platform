const db = require("../models");
const User = db.user;
const Buyer = db.buyer;
const Seller = db.seller;
const { hashPassword } = require("./hashPassword");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email,
        }
    }).then((result) => {
        if (result) {
            console.log(result)
            res.status(409).send({success: false, message: "email is existed."})
        } else {
            const password = req.body.password;
            hashPassword(password).then(({hash, salt}) => {
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    dob: req.body.dob,
                    password: hash,
                }).then((data) => {
                    Buyer.create({
                        userId: data.id,
                    });
                    res.status(200).send({success: true, message: "User account is created."})
                }).catch(error => {
                    res.status(500).send({success: false, message: error.message})
                }) 
            })
            
        }
    }).catch ((error) => {
        res.status(500).send({success: false, message: error.message})
    });
};

exports.signIn = (req, res) => {
    const password = req.body.password;
    User.findOne({
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
                        {expiresIn: '1h'}
                    );
                    Seller.findOne({
                        where: {
                            userId: data.id,
                        }
                    }).then(() => {
                        res.status(200).send({success: true, message: {accessToken: token, message: data.id}});
                    });
                } else {
                    res.status(400).send({success: false, message: "Invalid password."});
                }
            });
        } else {
            res.status(400).send({success: false, message: "Invalid email."});
        }
    }).catch(error => {
        res.status(500).send({success: false, message: error.message});
    })
};

exports.createSellerAccount = (req, res) => {
    User.findOne({
        where: {
            id: req.body.userId,
        }
    }).then((result) => {
        Seller.create({
            userId: result.id,
        }).then(() => {
            res.status(200).send({success: true, message: "Seller account is created."})
        }).catch(error => {
            res.status(500).send({success: false, message: error.message})
        }) 
    }).catch ((error) => {
        res.status(500).send({success: false, message: error.message})
    });
}