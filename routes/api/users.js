const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../../models/User");

// @route         GET api/users/test
// @description   Tests users route
// @access        Public route
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// Create route for the registration page
// @route         GET api/users/register
// @description   Register user
// @access        Public
// Post request: (request, response)
router.post("/register", (req, res) => {
  //Send in our form via POST
  // Find if the email exists:
  User.findOne({ email: req.body.email }).then(user => {
    // Gets all the info in the request body
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
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

module.exports = router;
