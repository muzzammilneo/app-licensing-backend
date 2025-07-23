require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const licenseRoutes = require("./routes/licenseRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/license", licenseRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => console.error("MongoDB error:", err));
