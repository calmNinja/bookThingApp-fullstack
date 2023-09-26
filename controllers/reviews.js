const Book = require("../models/book");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      req.flash("error", "Book not found");
      return res.redirect("/books");
    }
    const review = new Review(req.body.review);
    review.book = book;
    review.author = req.user._id;
    book.reviews.push(review);
    await review.save();
    await book.save();
    req.flash("success", "Successfully posted your review!");
    res.redirect(`/books/${book._id}`);
  } catch {
    console.error("Error creating review:", err);
    req.flash("error", "An error occurred while creating the review");
    res.redirect("/books");
  }
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Book.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Your review has been deleted!");
  res.redirect(`/books/${id}`);
};

module.exports.RenderReviewEditForm = async (req, res) => {
  const { id, reviewId } = req.params;
  const book = await Book.findById(id);
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Cannot find that review!");
    return res.redirect("/books");
  }
  res.render("reviews/edit", { book, review });
};

module.exports.updateReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const review = await Review.findByIdAndUpdate(reviewId, req.body.review, {
    new: true,
  });
  req.flash("success", "Successfully updated review!");
  res.redirect(`/books/${id}`);
};
