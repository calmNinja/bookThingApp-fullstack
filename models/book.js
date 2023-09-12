const mongoose = require("mongoose");
const Review = require("./review");
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

//Mongoose middleware to delete associated reviews
//Delete All Reviews associated with book upon Book deletion
BookSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Book", BookSchema);
