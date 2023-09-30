const Book = require("../models/book");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const books = await Book.find({});
  res.render("books/index", { books });
};

//function to check if book is shelved
const isBookShelved = (bookshelf, bookId) => {
  const bookInBookshelf = bookshelf.find((item) =>
    item.book._id.equals(bookId)
  );
  return bookInBookshelf && bookInBookshelf.isShelved;
};

module.exports.bookDescription = async (req, res) => {
  let bookshelf;
  try {
    const book = await Book.findById(req.params.id).populate({
      path: "reviews",
      populate: { path: "author" },
    });
    const book_genres = book.genre[0]
      .replace(/,/g, " | ")
      .replace(/[\[\]']+/g, "");
    if (!book) {
      req.flash(
        "error",
        "Sorry :( The title you are looking for is not available."
      );
      return res.redirect("/books");
    }
    //Check if user has already reviewed the book
    let userHasReviewed = false;
    let isShelved;
    // let isShelved = false;
    if (req.isAuthenticated()) {
      //fetch the user's bookshelf data
      const user = await User.findById(req.user._id);
      isShelved = isBookShelved(user.bookshelf, book._id);

      //check if the user has already reviewed the book
      userHasReviewed = book.reviews.some((review) => {
        return review.author.equals(req.user._id);
      });
    }

    res.render("books/show", { book, book_genres, userHasReviewed, isShelved });
  } catch (error) {
    console.error(error);
    req.flash("error", "The title you are looking for is no longer available.");
    res.redirect("/books");
  }
};

module.exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  await Book.findByIdAndDelete(id);
  res.redirect(`/books`);
};
