const express = require("express");
const cors = require("cors");
const connectToDb = require("./db/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.routes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



connectToDb();

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use('/users', userRoutes);

module.exports = app;
