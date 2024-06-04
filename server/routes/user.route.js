const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
const authenticateToken = require("./authenticate.route");

// router.use(authenticateToken);

router.get("/sign-in", controller.signIn);
router.post("/create-seller-account",authenticateToken, controller.createSellerAccount);

module.exports = router;