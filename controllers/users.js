const User = require("../models/user");
const Review = require("../models/review");
const Book = require("../models/book");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

//Render User Registration Form
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

//Register User
module.exports.register = async (req, res, next) => {
  try {
    const {
      email,
      username,
      password,
      firstname,
      lastname,
      avatar,
      adminCode,
    } = req.body;

    //check if the user registered adminCode matched the adminCode in the .env
    const isAdmin = adminCode === process.env.ADMIN_PASSWORD;
    const user = new User({
      email,
      username,
      firstname,
      lastname,
      avatar,
      isAdmin,
    });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Hey ${firstname}, Welcome to BookThing!`);
      res.redirect("/books");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

//Render User Login Form
module.exports.renderLogin = (req, res) => {
  if (req.query.returnTo) {
    req.session.returnTo = req.query.returnTo;
  }
  res.render("users/login");
};

//Log in the User
module.exports.loginUser = (req, res) => {
  const { username } = req.body;
  const { firstname, _id } = req.user;
  req.flash("success", `Welcome back, ${firstname}!`);
  redirectUrl = res.locals.returnTo || "/books";
  res.redirect(redirectUrl);
};

//Log out User
module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You've been logged out!");
    res.redirect("/");
  });
};

//Show User Profile
module.exports.showUserProfile = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id).populate(
      "bookshelf.book"
    );
    if (!foundUser) {
      req.flash("error", "Couldn't find the user :( ");
      res.redirect("/");
    } else {
      const userReviews = await Review.find({
        author: foundUser._id,
      }).populate("book");
      res.render("users/userProfile", { foundUser, userReviews });
    }
  } catch (err) {
    req.flash(
      "error",
      "An error occurred while finding the user or their reviews"
    );
    res.redirect("/books");
  }
};

//Add Book to BookShelf in UserProfile
module.exports.addToBookshelf = async (req, res) => {
  const userId = req.user._id;
  const bookId = req.params.bookId;
  try {
    const user = await User.findById(userId);
    const existingBook = user.bookshelf.find(
      (item) => item.book.toString() === bookId
    );
    if (!existingBook) {
      user.bookshelf.push({ book: bookId, isShelved: true });
      await user.save();
      req.flash("success", "Successfully added to bookshelf.");
      // res.redirect(`/users/${userId}`);
      res.redirect(`/books/${bookId}`);
    } else {
      req.flash("error", "This Book has already been shelved!");
      res.redirect(`/books/${bookId}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Remove Book from Bookshelf in userProfile
module.exports.removeFromBookshelf = async (req, res) => {
  const userId = req.params.id;
  const bookId = req.params.bookId;
  try {
    const user = await User.findById(userId);
    //check if the book exists in the user's bookshelf and get it's index in the array
    const bookIndex = user.bookshelf.findIndex(
      (item) => item.book.toString() === bookId
    );
    //if bookshelf not empty
    if (bookIndex !== -1) {
      //set the flag back to false
      user.bookshelf[bookIndex].isShelved = false;
      //remove the book
      user.bookshelf.splice(bookIndex, 1);
      await user.save();
      req.flash("success", "Successfully removed book from Bookshelf.");
      res.redirect(`/books/${bookId}`);
      // res.redirect(`/users/${userId}`);
    } else {
      req.flash("error", "Book not found in your bookshelf!");
      res.redirect(`/users/${userId}`);
    }
  } catch (error) {
    console.error(error);
    req.flash(
      "error",
      "An error occured while trying to remove book from bookshelf."
    );
    res.redirect(`/users/${userId}`);
  }
};

//Render Forgot Password Form
module.exports.renderForgotPassword = (req, res) => {
  res.render("users/forgot-password");
};

// Submit Forgot Password Form to Reset Password
module.exports.forgotPassword = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(20).toString("hex");
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      req.flash("error", "No account with that email address exists.");
      return res.redirect("/users/forgot-password");
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "calmninja2023@gmail.com",
        pass: process.env.GMAILPW,
      },
    });

    const mailOptions = {
      to: user.email,
      from: "calmninja2023@gmail.com",
      subject: "BookThing Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://${req.headers.host}/reset/${token}\n\nIf you did not request this, please ignore this email, and your password will remain unchanged.`,
    };

    await smtpTransport.sendMail(mailOptions);

    req.flash(
      "success",
      `An e-mail has been sent to ${user.email} with further instructions.`
    );
    return res.redirect("/forgot-password");
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

//Render Update Password Form
module.exports.renderResetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "Password reset token is invalid or has expired.");
      return res.redirect("/forgot-password");
    }
    res.render("users/reset-password", { token: req.params.token });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while processing your request.");
    res.redirect("/forgot-password");
  }
};

//Update New Password for Password Reset
module.exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "Password reset token is invalid or has expired.");
      return res.redirect("back");
    }

    if (req.body.password === req.body.confirm) {
      await user.setPassword(req.body.password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      await req.logIn(user, (err) => {
        if (err) {
          console.error(err);
          req.flash("error", "An error occurred while logging in.");
          return res.redirect("/login");
        } else {
          res.redirect("/books");
        }
      });
    } else {
      req.flash("error", "Passwords do not match.");
      return res.redirect("back");
    }
    const smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "calmninja2023@gmail.com",
        pass: process.env.GMAILPW,
      },
    });
    const mailOptions = {
      to: user.email,
      from: "calmninja2023@gmail.com",
      subject: "Your password has been changed",
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
    };

    await smtpTransport.sendMail(mailOptions);
    // req.flash("success", "Success! Your password has been changed.");
    // res.redirect("/books");
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while resetting the password.");
    res.redirect("/reset/${req.params.token}");
  }
};
