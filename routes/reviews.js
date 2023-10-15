const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Book = require("../models/book");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");
const { reviewSchema } = require("../schemas.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

//Create Book Review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

//Edit Book Review Form
router.get(
  "/:reviewId/edit",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.RenderReviewEditForm)
);

//Update Book Review
//Delete Book Review

router
  .route("/:reviewId")
  .put(isLoggedIn, catchAsync(reviews.updateReview))
  .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
