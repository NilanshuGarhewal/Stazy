const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

const userController = require("../controllers/user");

// Render signup form
router.get("/signup", userController.renderSignupForm);

// Handle signup logic
router.post("/signup", wrapAsync(userController.signup));

// Render login form
router.get("/login", userController.renderLoginForm);

// Handle login logic
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// Handle logout logic
router.get("/logout", userController.logout);

module.exports = router;
