const Review = require("./models/review.js");
const { reviewSchema } = require("./schemas.js");
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

//Return to the last path before registering a new user
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

//validate review body
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
