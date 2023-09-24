const User = require("../models/user");

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
  res.render("users/login");
};

//Log in the User
module.exports.loginUser = (req, res) => {
  const { username } = req.body;
  const { firstname, _id } = req.user;
  req.flash("success", `Welcome back, ${firstname}!`);
  res.redirect("/");
  //   res.redirect(`/users/${_id}`);
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
      res.render("users/userProfile", { foundUser });
    }
  } catch (err) {
    req.flash("error", "An error occurred while finding the user");
    res.redirect("/");
  }
};
