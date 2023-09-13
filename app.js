const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { reviewSchema } = require("./schemas.js");
const Joi = require("joi");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Book = require("./models/book");
const Review = require("./models/review");

mongoose.connect("mongodb://127.0.0.1/bookthingapp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//Route to Home Page
app.get("/", (req, res) => {
  res.render("home");
});

//Route to Book Index
app.get(
  "/books",
  catchAsync(async (req, res) => {
    const books = await Book.find({});
    res.render("books/index", { books });
  })
);

//Route to Single Book Show Page
app.get(
  "/books/:id",
  catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("reviews");
    res.render("books/show", { book });
  })
);

//Route to delete a book - for admin only TBD
app.delete(
  "/books/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await Book.findByIdAndDelete(id);
    res.redirect(`/books`);
  })
);

//Create Book Review
app.post(
  "/books/:id/reviews",
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
app.get(
  "/books/:id/reviews/:reviewId/edit",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const book = await Book.findById(id);
    const review = await Review.findById(reviewId);
    res.render("reviews/edit", { book, review });
  })
);
//Update Edited Review - TBD

//Delete Book Review
app.delete(
  "/books/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/books/${id}`);
  })
);

//Express Error Handling
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Sorry but Something went Wrong!!";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
