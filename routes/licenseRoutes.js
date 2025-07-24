const express = require("express");
const router = express.Router();
const { validateLicense } = require("../controllers/licenseController");

router.post("/validate", validateLicense);
router.post("/", (req, res)=> {
    return "Hello";
});

module.exports = router;
