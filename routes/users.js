const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const { checkReturnTo } = require("../middleware");

//User Registration
router.get("/register", users.renderRegister);

router.post("/register", catchAsync(users.register));

//User Login
router.get("/login", users.renderLogin);

router.post(
  "/login",
  checkReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.loginUser
);

//User Logout
router.get("/logout", users.logoutUser);

//User Profile
router.get("/users/:id", catchAsync(users.showUserProfile));

module.exports = router;

//Add books to User BookShelf
router.post("/users/:id/bookshelf/:bookId", catchAsync(users.addToBookshelf));
