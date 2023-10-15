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
  validatePasswordChange,
  validateResetPassword,
} = require("../middleware");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

//User Registration
router
  .route("/register")
  .get(users.renderRegister)
  .post(validateNewUser, catchAsync(users.register));

//User Login
router
  .route("/login")
  .get(users.renderLogin)
  .post(
    checkReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

//User Logout
router.get("/logout", users.logoutUser);

//Add/Remove books to User BookShelf
router
  .route("/users/:id/bookshelf/:bookId")
  .post(catchAsync(users.addToBookshelf))
  .delete(catchAsync(users.removeFromBookshelf));

//Forgot password routes
router
  .route("/forgot-password")
  .get(users.renderForgotPassword)
  .post(catchAsync(users.forgotPassword));

//Update password routes
router
  .route("/reset/:token")
  .get(catchAsync(users.renderResetPassword))
  .post(validateResetPassword, catchAsync(users.resetPassword));

//User Profile routes
//Show User Profile, Update Edited User Profile, Delete User Account
router
  .route("/users/:id")
  .get(catchAsync(users.showUserProfile))
  .put(
    isLoggedIn,
    isProfileOwner,
    validateUserProfileEdit,
    catchAsync(users.updateUserProfile)
  )
  .delete(isLoggedIn, isProfileOwner, catchAsync(users.deleteUserAccount));

//Edit User Profile
router.get(
  "/users/:id/edit",
  isLoggedIn,
  isProfileOwner,
  users.renderEditUserProfile
);

//Render Change Password Form / Update Changed Password

router
  .route("/users/:id/changepassword")
  .get(isLoggedIn, isProfileOwner, users.renderChangePassword)
  .put(
    isLoggedIn,
    isProfileOwner,
    validatePasswordChange,
    catchAsync(users.updateChangedPassword)
  );

module.exports = router;
