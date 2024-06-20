const controller = require("../controllers/order.controller");
const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeUser } = require("./authenticate.route");

router.use(authenticateToken);

router.post("/create-order", authorizeUser(["Buyer"]), controller.createOrder);
router.put("/update-status", authorizeUser(["Seller"]), controller.updateStatus);
// router.delete("/delete-item", controller.deleteItemFromCart);
// router.put("/decrease-quantity", controller.decreaseItemInCart)
// router.get("/view-cart/:cartId", controller.viewCart);

module.exports = router;