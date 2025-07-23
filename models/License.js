const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema({
  licenseKey: { type: String, unique: true, required: true },
  email: String,
  deviceId: String,
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("License", licenseSchema);
