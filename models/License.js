const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema({
  user: String,
  address: String,
  contact: String,
  licenseKey: { type: String, unique: true, required: true },
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("License", licenseSchema);
