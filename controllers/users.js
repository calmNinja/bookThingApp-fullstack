const User = require("../models/user");
const Review = require("../models/review");
const Book = require("../models/book");

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
    const foundUser = await User.findById(req.params.id);
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

//Add Books to BookShelf in UserProfile
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
      res.redirect("/");
    } else {
      req.flash("error", "This Book has already been shelved!");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
