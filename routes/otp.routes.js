const { createOtp, verifyOtp } = require("../controllers/otp.controller");

const router = require("express").Router();

router.post("/create", createOtp);
router.post("/verify", verifyOtp);

module.exports = router;
