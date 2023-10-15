const express = require("express");
const router = express.Router();
const books = require("../controllers/books");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Book = require("../models/book");
const { isLoggedIn, isAdminAccount } = require("../middleware");

//Route to Book Index
router.get("/", catchAsync(books.index));

//Route to Single Book Show Page
//Route to Delete a Book - for Admin only
router
  .route("/:id")
  .get(catchAsync(books.bookDescription))
  .delete(isLoggedIn, isAdminAccount, catchAsync(books.deleteBook));

module.exports = router;
