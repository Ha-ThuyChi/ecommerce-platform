const controller = require("../controllers/shop.controller");
const express = require("express");
const router = express.Router();
const authenticateToken = require("./authenticate.route");

router.use(authenticateToken);

router.post("/create-shop", controller.createShop);
router.get("/view-shop/:shopId", controller.viewShop);
router.put("/edit-shop", controller.editShop);
router.put("/delete-shop/:shopId", controller.deleteShop);
router.put("/request-to-open-shop/:shopId", controller.requestToOpenShop);

module.exports = router;