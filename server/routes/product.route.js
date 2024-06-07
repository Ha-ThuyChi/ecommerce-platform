const controller = require("../controllers/product.controller");
const express = require("express");
const router = express.Router();
const authenticateToken = require("./authenticate.route");

router.use(authenticateToken);

router.post("/create-product", controller.createProduct);
router.delete("/delete-product/:productId", controller.deleteProduct);
router.get("/view-product/:productId", controller.viewProduct);
router.put("/edit-product", controller.editProduct);

module.exports = router;