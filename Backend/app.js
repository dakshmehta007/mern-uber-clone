const express = require("express");
const cors = require("cors");
const connectToDb = require("./db/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const cookieParser = require("cookie-parser");
const mapRoutes = require("./routes/map.routes");
const rideRoutes = require("./routes/ride.routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Ensure the port is correctly set
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectToDb();

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/users", userRoutes);
app.use("/captain", captainRoutes);
app.use("/maps", mapRoutes);
app.use("/rides", rideRoutes);


module.exports = app;
