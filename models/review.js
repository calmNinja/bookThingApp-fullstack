const mongoose = require("mongoose");
const User = require("./user");
const Book = require("./book");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
