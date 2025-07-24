const express = require("express");
const router = express.Router();
const { validateLicense } = require("../controllers/licenseController");
const { registerLicense } = require("../controllers/licenseController");
const { deleteLicense } = require("../controllers/licenseController");

router.post("/validate", validateLicense);
router.post("/register", registerLicense);
router.delete("/delete", deleteLicense);

module.exports = router;
