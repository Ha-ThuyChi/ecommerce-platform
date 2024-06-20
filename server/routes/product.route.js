const controller = require("../controllers/product.controller");
const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeUser } = require("./authenticate.route");

router.use(authenticateToken);
router.use(authorizeUser(["Seller"]));

router.post("/create-product", controller.createProduct);
router.delete("/delete-product/:productId", controller.deleteProduct);
router.get("/view-product/:productId", controller.viewProduct);
router.put("/edit-product", controller.editProduct);

module.exports = router;