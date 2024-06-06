const controller = require("../controllers/product.controller");
const express = require("express");
const router = express.Router();
const authenticateToken = require("./authenticate.route");

router.use(authenticateToken);

// router.post("/creat", controller.createShop);

module.exports = router;