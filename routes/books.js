const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Book = require("../models/book");

//Route to Book Index
router.get(
  "/",
  catchAsync(async (req, res) => {
    const books = await Book.find({});
    res.render("books/index", { books });
  })
);
//Route to Single Book Show Page
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("reviews");
    if (!book) {
      req.flash(
        "error",
        "Sorry :( The title you are looking for is no longer available.."
      );
      return res.redirect("/books");
    }
    res.render("books/show", { book });
  })
);

//Route to delete a book - for admin only TBD
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await Book.findByIdAndDelete(id);
    res.redirect(`/books`);
  })
);

module.exports = router;
