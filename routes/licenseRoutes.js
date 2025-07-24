const express = require("express");
const router = express.Router();
const { validateLicense } = require("../controllers/licenseController");

router.post("/validate", validateLicense);
router.get("/", ()=> {
    return "Hello";
});

module.exports = router;
