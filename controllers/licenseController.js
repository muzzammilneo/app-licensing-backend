const License = require("../models/License");

exports.validateLicense = async (req, res) => {
  const { licenseKey, deviceId } = req.body;

  if (!licenseKey || !deviceId) {
    return res.status(400).json({ valid: false, reason: "Missing license key or device ID" });
  }

  const license = await License.findOne({ licenseKey });

  if (!license) return res.status(403).json({ valid: false, reason: "License not found" });
  if (!license.isActive) return res.status(403).json({ valid: false, reason: "License deactivated" });
  if (license.deviceId && license.deviceId !== deviceId) return res.status(403).json({ valid: false, reason: "License used on another device" });
  if (license.expiresAt && new Date() > license.expiresAt) return res.status(403).json({ valid: false, reason: "License expired" });

  return res.json({ valid: true, license });
};


exports.registerLicense = async (req, res) => {
  try {
    const { licenseKey, email, deviceId } = req.body;

    if (!licenseKey || !email || !deviceId) {
      return res.status(400).json({ success: false, reason: "Missing license key, email, or device ID" });
    }

    // Check if any of the identifiers already exist
    const existing = await License.findOne({
      $or: [
        { licenseKey },
        { email },
        { deviceId }
      ]
    });

    if (existing) {
      let conflictField = "";
      if (existing.licenseKey === licenseKey) conflictField = "licenseKey";
      else if (existing.email === email) conflictField = "email";
      else if (existing.deviceId === deviceId) conflictField = "deviceId";

      return res.status(403).json({ success: false, reason: `${conflictField} already in use` });
    }

    // Create and save new license
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const newLicense = new License({
      licenseKey,
      email,
      deviceId,
      isActive: true,
      expiresAt: oneYearFromNow,
    });
    await newLicense.save();

    return res.status(201).json({ success: true, message: "License registered successfully" });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, reason: "Internal server error" });
  }
};

exports.deleteLicense = async (req, res) => {
  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ success: false, message: "License key is required" });
    }

    const deleted = await License.findOneAndDelete({ licenseKey });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "License not found" });
    }

    return res.status(200).json({ success: true, message: "License deleted successfully" });

  } catch (error) {
    console.error("Delete license error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
