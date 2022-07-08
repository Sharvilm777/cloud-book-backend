const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const fetchuser = require("../middleware/fetchuser");
var bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const JWT_SECRET_TOKEN = "ThisismysecretToken$143";
var jwt = require("jsonwebtoken");
//Route 1 : Creating a User :POST : api/auth/signup : NO LOGIN Required
router.post(
  "/signup",
  [
    // username must be an email
    body("name", "Enter a valid name with min length of 3").isLength({
      min: 3,
    }),
    body("email", "Enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body("password", "password must be 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    let success = "false";
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.json({ success, error: "User with this email already exist" });
    } else {
      // To create a salt we have to call the method bcrypt.genSalt() this will generate the salt and this will return a promise so we have to await for that or we can use the callback function methods
      const salt = await bcrypt.genSalt(10);
      //We can create a hash of salt and password by the bcrypt.hash() it takes password and salt and it will generate the hash of the both And this is also returns a promise so we have to await for that or we can use callback functions.
      const securePassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET_TOKEN);
      res.json({
        success: "true",
        status: "User added successfully",
        authToken,
      });
    }
  }
);
//Route 2 : Authenticating a user (Login) :POST : api/auth/login :LOGIN Required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cant be blank ").exists(),
  ],
  async (req, res) => {
    let success = "fasle";
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        res
          .status(401)
          .json({ success, message: "Login with correct credintials" });
      }
      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        res
          .status(401)
          .json({ success, message: "Login with correct credintials" });
      } else {
        const data = {
          user: {
            id: user.id,
          },
        };
        const authToken = jwt.sign(data, JWT_SECRET_TOKEN);
        res.json({
          Status: "Logined Successfully",
          success: "true",
          authToken,
        });
      }
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);
//Route 3 : Fetch the logged in user details from DB :POST : api/auth/fetchuser :LOGIN Required
router.post("/fetchuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id,
      success = "false";
    let user = await User.findById(userId).select("-password");
    res.send({ user, success: "true" });
  } catch (error) {}
});

module.exports = router;
