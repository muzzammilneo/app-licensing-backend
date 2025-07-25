const License = require("../models/License");

exports.allLicense = async (req, res) => {
  if(!req.body) return res.status(400).json({ success: false, message: "You are not authorised to access!" });

  const { id } = req.body;

  if(id === 'admin') {
    try {
      const licenses = await License.find();
      return res.json(licenses);
    } catch (error) {
      console.error("Error fetching licenses:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};

exports.validateLicense = async (req, res) => {
  const { licenseKey } = req.body;

  if (!licenseKey) return res.status(400).json({ valid: false, reason: "Missing license key" });

  const license = await License.findOne({ licenseKey });

  if (!license) return res.status(404).json({ valid: false, reason: "License not found" });
  if (!license.isActive) return res.status(403).json({ valid: false, reason: "License deactivated" });
  if (license.expiresAt && new Date() > license.expiresAt) return res.status(403).json({ valid: false, reason: "License expired" });

  return res.json({ valid: true, license });
};


exports.registerLicense = async (req, res) => {
  try {
    const { user, address, contact, licenseKey } = req.body;

    if (!licenseKey || !contact) {
      return res.status(400).json({ success: false, reason: "Missing license key, contact, or device ID" });
    }

    // Check if any of the identifiers already exist
    const existing = await License.findOne({
      $or: [
        { licenseKey }
      ]
    });

    if (existing) {
      let conflictField = "";
      if (existing.licenseKey === licenseKey) conflictField = "licenseKey";

      return res.status(403).json({ success: false, reason: `${conflictField} already in use` });
    }

    // Create and save new license
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const newLicense = new License({
      user,
      address,
      contact,
      licenseKey,
      isActive: true,
      expiresAt: oneYearFromNow,
    });
    await newLicense.save();

    return res.status(201).json({ success: true, message: "License registered successfully" });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, reason: "Internal server error", error: error.message });
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
