const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

//User Registration
router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password, firstname, lastname, avatar } =
        req.body;
      const user = new User({ email, username, firstname, lastname, avatar });
      const registeredUser = await User.register(user, password);
      req.flash("success", "Welcome to BookThing!");
      res.redirect("/books");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

//User Login
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/books");
  }
);

//User Logout
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You've been logged out!");
    res.redirect("/");
  });
});

module.exports = router;
