const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load Input Validation:
const validateRegisterInput = require("../../validation/register");

// Load User model
const User = require("../../models/User");

// @route         GET api/users/test
// @description   Tests users route
// @access        Public route
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// Create route for the registration page:
// @route         GET api/users/register
// @description   Register user
// @access        Public
// Post request: (request, response)
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  //Send in our form via POST
  // Find if the email exists:
  User.findOne({ email: req.body.email }).then(user => {
    // Gets all the info in the request body
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        // Pass in email info through gravatar
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      // Create new user:
      const newUser = new User({
        name: req.body.name, // Comes from React form
        email: req.body.email, // Comes from React form
        avatar,
        password: req.body.password // Comes from React form
      });

      // Generate salt with bcrypt. Hash the pw with salt. Makes pw crypted:
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // Set pw to hashed pw:
          newUser.password = hash;
          // Save the User:
          newUser
            .save()
            // Respond with the User in JSON:
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
  //Find email that matches request.body.email. Access it by req.body.___
});

// @route         GET api/users/login
// @description   Login user / Returning JWT Token
// @access        Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    // Check password
    bcrypt
      .compare(password, user.password) // user.password is the hashed pw in db
      .then(isMatch => {
        if (isMatch) {
          // User Matched:

          const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create jwt payload

          // Sign Token:
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token // Will take this and put in header as authorization. Will send to server and validate user.
              });
            }
          ); // json web token: Take in payload. keys.secretOrKey is coming from keys.js (keys.js imported at top)
        } else {
          return res.status(400).json({ password: "Password incorrect" });
        }
      });
  });
});

// @route         GET api/users/current
// @description   Return current user
// @access        Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      // Return everything but the password.
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
