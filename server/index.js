const { syncModel } = require("./initDatabase");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const controller = require("./controllers/user.controller");
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const shopRoutes = require("./routes/shop.route");
const productRoutes = require("./routes/product.route");
const promotionRoutes = require("./routes/promotion.route");

syncModel();
app.use(express.json());

//middleware 
app.use(bodyParser.json());
app.use(cors());

//routes
app.post("/create-user", controller.createUser)
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/product", productRoutes);
app.use("/api/promotion", promotionRoutes);

//connect
app.listen(2222, () => {
  console.log("Connected to server.")
})