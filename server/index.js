const { syncModel } = require("./initDatabase");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin.route");

syncModel();
app.use(express.json());

//middleware 
app.use(bodyParser.json());
app.use(cors());

//routes
app.use("/api/admin", adminRoutes);

//connect
app.listen(2222, () => {
  console.log("Connected to server.")
})