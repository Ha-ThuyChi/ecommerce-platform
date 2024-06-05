const controller = require("../controllers/admin.controller");
const express = require("express");
const router = express.Router();
const authenticateToken = require("./authenticate.route");

// router.use(authenticateToken);

router.post("/create-admin", authenticateToken, controller.createAdmin);
router.get("/sign-in", controller.signIn);
router.put("/edit-status-seller-account", authenticateToken, controller.editStatusSellerAccount);
router.put("/edit-status-user-account", authenticateToken, controller.editStatusUserAccount)

module.exports = router;