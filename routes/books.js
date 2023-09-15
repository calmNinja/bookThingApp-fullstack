const express = require("express");
const router = express.Router();
const books = require("../controllers/books");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Book = require("../models/book");
const { isLoggedIn } = require("../middleware");

//Route to Book Index
router.get("/", catchAsync(books.index));
//Route to Single Book Show Page
router.get("/:id", catchAsync(books.bookDescription));

//Route to delete a book - for admin only TBD
router.delete("/:id", isLoggedIn, catchAsync(books.deleteBook));

module.exports = router;
