const db = require("../models");
const Admin = db.admin;
const { hashPassword }= require("./hashPassword");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createAdmin = (req, res) => {
    Admin.findOne({
        where: {
            username: req.body.username,
        }
    }).then((result) => {
        if (result) {
            res.status(409).send({success: false, message: "Username is existed."})
        } else {
            const password = req.body.password
            hashPassword(password).then(({hash, salt}) => {
                Admin.create({
                    name: req.body.name,
                    username: req.body.username,
                    password: hash,
                }).then(() => {
                    res.status(200).send({success: true, message: "Admin account is created."})
                }).catch(error => {
                    res.status(500).send({success: false, message: error.message})
                }) 
            })
            
        }
    }).catch ((error) => {
        res.status(500).send({success: false, message: error.message})
    });
}

exports.signIn = (req, res) => {
    const password = req.body.password;
    Admin.findOne({
        where: {
            username: req.body.username, // check username
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
}