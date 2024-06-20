const controller = require("../controllers/promotion.controller");
const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeUser } = require("./authenticate.route");

router.use(authenticateToken);
router.use(authorizeUser(["Seller", "Admin"]));

router.post("/create-promotion", controller.createPromotion);
router.delete("/delete-promotion/:promotionId", controller.deletePromotion);
router.get("/view-promotion/:promotionId", controller.viewPromotion);
router.put("/edit-promotion", controller.editPromotion);

module.exports = router;