const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: String,
  author: String,
  description: String,
  year: String,
  genre: Array,
  avgRating: String,
  image: String,
  series: String,
  pages: String,
  awards: Array,
  liked: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Book", BookSchema);
