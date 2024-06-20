const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeUser } = require("./authenticate.route");

// Sign in, Sign up for user (Admin, Buyer, Seller)
router.get("/sign-in", controller.signIn);
router.post("/create-user", controller.createUser);

router.use(authenticateToken);

router.post("/create-seller-account", controller.createSellerAccount);
router.get("/view-user/:userId", controller.viewUser);
router.put("/edit-user", controller.editUser);
router.put("/delete-user/:userId", authorizeUser(["Buyer"]), controller.deleteUser);


module.exports = router;