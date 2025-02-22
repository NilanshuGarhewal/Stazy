const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

const userController = require("../controllers/user");

router
  .route("/signup")
  .get(userController.renderSignupForm) // Render signup form
  .post(wrapAsync(userController.signup)); // Handle signup logic

// Render login form
router
  .route("/login")
  .get(userController.renderLoginForm) // Render login form
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  ); // Handle login logic

// Handle logout logic
router.get("/logout", userController.logout);

module.exports = router;
