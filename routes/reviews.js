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

//Edit Book Review
router.get(
  "/:reviewId/edit",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const book = await Book.findById(id);
    const review = await Review.findById(reviewId);
    res.render("reviews/edit", { book, review });
  })
);

//Update Edited Review - TBD

//Delete Book Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
