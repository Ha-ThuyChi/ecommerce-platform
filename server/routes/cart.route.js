const controller = require("../controllers/cart.controller");
const express = require("express");
const router = express.Router();
const authenticateToken = require("./authenticate.route");

router.use(authenticateToken);

router.post("/add-item", controller.addItemToCart);
router.delete("/delete-item", controller.deleteItemFromCart);
router.put("/decrease-quantity", controller.decreaseItemInCart)
router.get("/view-cart/:cartId", controller.viewCart);

module.exports = router;