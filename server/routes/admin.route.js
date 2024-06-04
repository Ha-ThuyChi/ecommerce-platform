const controller = require("../controllers/admin.controller");
const express = require("express");
const router = express.Router();
const authenticateToken = require("./authenticate.route");

// router.use(authenticateToken);

router.post("/create-admin", authenticateToken, controller.createAdmin);
router.get("/sign-in", controller.signIn);

module.exports = router;