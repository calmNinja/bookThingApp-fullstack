const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Book = require("../models/book");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//Create Book Review
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    const review = new Review(req.body.review);
    book.reviews.push(review);
    await review.save();
    await book.save();
    res.redirect(`/books/${book._id}`);
  })
);

//Edit Book Review
router.get(
  "/:reviewId/edit",
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
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/books/${id}`);
  })
);

module.exports = router;
