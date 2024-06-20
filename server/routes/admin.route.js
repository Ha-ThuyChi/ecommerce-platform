const controller = require("../controllers/admin.controller");
const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeUser } = require("./authenticate.route");

router.use(authenticateToken);
router.use(authorizeUser(["Admin"]));

router.post("/assign-admin-role", controller.assignAdminRole);
router.put("/edit-status-seller-account", controller.editStatusSellerAccount);
router.put("/edit-status-user-account", controller.editStatusUserAccount);
router.put("/edit-status-shop", controller.editStatusShop);

module.exports = router;