const Review = require("./models/review.js");
const {
  reviewSchema,
  registrationSchema,
  profileEditSchema,
  passwordChangeSchema,
  resetPasswordSchema,
} = require("./schemas.js");
const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");

//Check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must sign in first!");
    return res.redirect("/login");
  }
  next();
};

//Check if current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!(review.author.equals(req.user._id) || req.user.isAdmin)) {
    req.flash("error", "You do not have the permission to modify this review");
    return res.redirect(`/books/${id}`);
  }
  next();
};

//Validate review body
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//Return to the last path where the user was
module.exports.checkReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

//Check if current user is also user of the Profile
module.exports.isProfileOwner = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("back");
    }

    if (!user._id.equals(req.user._id) && !req.user.isAdmin) {
      req.flash("error", "You do not have permission to edit this profile.");
      return res.redirect(`/users/${req.params.id}`);
    }

    next();
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while checking ownership.");
    res.redirect("back");
  }
};

//Check if user is admin
module.exports.isAdminAccount = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    // The user is an admin, so allow access
    return next();
  } else {
    // The user is not an admin, deny access
    req.flash("error", "You do not have admin privileges.");
    res.redirect("back");
  }
};

//Validate New User Registration Form
module.exports.validateNewUser = (req, res, next) => {
  const { error } = registrationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Validate User Profile Editing
module.exports.validateUserProfileEdit = (req, res, next) => {
  const { error } = profileEditSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validatePasswordChange = (req, res, next) => {
  const { error } = passwordChangeSchema.validate(req.body);
  if (error) {
    if (error.details[0].message.includes("[ref:newPassword]")) {
      throw new ExpressError("Passwords do not match", 400);
    }
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateResetPassword = (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
