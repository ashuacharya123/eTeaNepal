// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("config");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const sendEmail = require('./email');


// Resend otp
router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User not found');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    const date = new Date(Date.now()+ 600000); // 10 minutes from now
      const futureTime = date.getTime();
    user.otpExpiry =futureTime;

    await user.save();
    sendEmail(email,"OTP verification", `Your OTP is ${otp}`);

        res.status(200).send('OTP sent to your email');
    } catch (error) {
        res.status(500).send('Error resending OTP');
    }
});

// Sign up
router.post("/signup", async (req, res) => {
  const { name, email, password, role, panCard } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ name, email, password, role, panCard });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    const date = new Date(Date.now()+ 600000); // 10 minutes from now
      const futureTime = date.getTime();
    user.otpExpiry =futureTime;

    await user.save();
    sendEmail(email,"OTP verification", `Your OTP is ${otp}`);

    res.status(200).json({ msg: "OTP sent to email" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    POST api/auth/verify
// @desc     Verify OTP
// @access   Public
router.post(
    "/verify",
    [
      check("email", "Please include a valid email").isEmail(),
      check("otp", "OTP is required").not().isEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, otp } = req.body;
  
      try {
        let user = await User.findOne({ email });
  
        if (!user) {
          return res.status(400).json({ msg: "User not found" });
        }
  
        const date = new Date(Date.now());
        const CurrentTime = date.getTime();
        const isOtpExpired = user.otpExpiry < CurrentTime;
  
        // Check if the OTP is correct and not expired
        if (user.otp === otp && !isOtpExpired) {
          // OTP is correct and not expired, proceed with verification
          user.otp = undefined;
          user.otpExpiry = undefined;
          await user.save();
  
          // Send success response
          return res.status(200).json({ msg: "OTP verified, now you can login" });
        } 
          // OTP is incorrect or expired, send error response
          if(isOtpExpired){
            return res.status(400).json({ msg: " OTP Expired" });
          }
          return res.status(400).json({ msg: "Invalid OTP" });
        
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    }
  );
  

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if(user.otp!==undefined){
        return res.status(400).json({ msg: "Please verify your OTP first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


//Reset Password

router.post(
    '/reset-password',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('otp', 'OTP is required').not().isEmpty(),
        check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp, newPassword } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            const date = new Date(Date.now());
        const CurrentTime = date.getTime();
        const isOtpExpired = user.otpExpiry < CurrentTime;
  
        // Check if the OTP is correct and not expired
        if (user.otp === otp && !isOtpExpired) {
          // OTP is correct and not expired, proceed with verification
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(newPassword, salt);
          user.otp = undefined;
          user.otpExpiry = undefined;
          await user.save();
  
          // Send success response
          return res.status(200).json({ msg: "Password reset successfully" });
        } 
          // OTP is incorrect or expired, send error response
          if(isOtpExpired){
            return res.status(400).json({ msg: " OTP Expired" });
          }
          return res.status(400).json({ msg: "Invalid OTP" });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);



module.exports = router;
