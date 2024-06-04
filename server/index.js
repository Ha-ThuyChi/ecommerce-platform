const { syncModel } = require("./initDatabase");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const controller = require("./controllers/user.controller");
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");

syncModel();
app.use(express.json());

//middleware 
app.use(bodyParser.json());
app.use(cors());

//routes
app.post("/create-user", controller.createUser)
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

//connect
app.listen(2222, () => {
  console.log("Connected to server.")
})