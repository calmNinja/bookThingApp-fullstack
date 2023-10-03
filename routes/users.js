const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const {
  checkReturnTo,
  isLoggedIn,
  isProfileOwner,
  validateNewUser,
  validateUserProfileEdit,
  validateNewPassword,
} = require("../middleware");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

//User Registration
router.get("/register", users.renderRegister);

router.post("/register", validateNewUser, catchAsync(users.register));

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

//Add books to User BookShelf
router.post("/users/:id/bookshelf/:bookId", catchAsync(users.addToBookshelf));

//Remove book from BookShelf
router.delete(
  "/users/:id/bookshelf/:bookId",
  catchAsync(users.removeFromBookshelf)
);

//Forgot password routes
router.get("/forgot-password", users.renderForgotPassword);
router.post("/forgot-password", catchAsync(users.forgotPassword));

//Update password routes
router.get("/reset/:token", catchAsync(users.renderResetPassword));
router.post("/reset/:token", catchAsync(users.resetPassword));

//User Profile
router.get("/users/:id", catchAsync(users.showUserProfile));

//Edit User Profile
router.get(
  "/users/:id/edit",
  isLoggedIn,
  isProfileOwner,
  users.renderEditUserProfile
);

//Update User Profile
router.put(
  "/users/:id",
  isLoggedIn,
  isProfileOwner,
  validateUserProfileEdit,
  catchAsync(users.updateUserProfile)
);

//Render Change Password Form
router.get(
  "/users/:id/changepassword",
  isLoggedIn,
  isProfileOwner,
  users.renderChangePassword
);

//Update Changed Password
router.put(
  "/users/:id/change-password",
  isLoggedIn,
  isProfileOwner,
  validateNewPassword,
  catchAsync(users.updateChangedPassword)
);

//Delete User Account
router.delete(
  "/users/:id",
  isLoggedIn,
  isProfileOwner,
  catchAsync(users.deleteUserAccount)
);
module.exports = router;
