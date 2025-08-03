const mongoose = require("mongoose");
require("dotenv").config(); // Ensure this line is present to load .env variables

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

module.exports = connectToDb;
