const Book = require("../models/book");

module.exports.index = async (req, res) => {
  const books = await Book.find({});
  res.render("books/index", { books });
};

module.exports.bookDescription = async (req, res) => {
  const book = await Book.findById(req.params.id).populate({
    path: "reviews",
    populate: { path: "author" },
  });
  if (!book) {
    req.flash(
      "error",
      "Sorry :( The title you are looking for is no longer available.."
    );
    return res.redirect("/books");
  }
  res.render("books/show", { book });
};

module.exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Book.findByIdAndDelete(id);
  res.redirect(`/books`);
};
