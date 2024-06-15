const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
const authenticateToken = require("./authenticate.route");

// router.use(authenticateToken);

router.get("/sign-in", controller.signIn);
router.post("/create-user", controller.createUser);
router.post("/create-seller-account",authenticateToken, controller.createSellerAccount);
router.get("/view-user/:userId", controller.viewUser);
router.put("/edit-user", controller.editUser);
router.put("/delete-user/:userId", controller.deleteUser);


module.exports = router;