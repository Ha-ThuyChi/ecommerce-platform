const controller = require("../controllers/product.controller");
const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeUser } = require("./authenticate.route");

router.use(authenticateToken);

router.get("/get-products/:pageNum",controller.getSomeProducts);
router.get("/view-product/:productId", controller.viewProduct);

router.use(authorizeUser(["Seller"]));

router.post("/create-product", controller.createProduct);
router.delete("/delete-product/:productId", controller.deleteProduct);
router.put("/edit-product", controller.editProduct);

module.exports = router;