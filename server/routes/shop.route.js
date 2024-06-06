const controller = require("../controllers/shop.controller");
const express = require("express");
const router = express.Router();
const authenticateToken = require("./authenticate.route");

router.use(authenticateToken);

router.post("/create-shop", controller.createShop);

module.exports = router;