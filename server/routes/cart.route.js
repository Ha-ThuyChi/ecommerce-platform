const controller = require("../controllers/cart.controller");
const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeUser } = require("./authenticate.route");

router.use(authenticateToken);
router.use(authorizeUser(["Buyer"]));

router.post("/add-item", controller.addItemToCart);
router.delete("/delete-item", controller.deleteItemFromCart);
router.put("/update-quantity", controller.updateQuantity)
router.get("/view-cart/:userId", controller.viewCart);

module.exports = router;