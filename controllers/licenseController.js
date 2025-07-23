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
