const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// Render signup form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// Handle signup logic
router.post("/signup", async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Stazy!");
      res.redirect("/stazy");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

// Render login form
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// Handle login logic
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back!");
    // const redirectUrl = req.session.returnTo || "/stazy";
    // delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

// Handle logout logic
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/stazy");
  });
});

module.exports = router;
