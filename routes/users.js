const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

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

module.exports = router;
