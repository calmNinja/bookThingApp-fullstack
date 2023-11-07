const mongoose = require("mongoose");
const Book = require("../models/book");
const books = require("./books-sample");
// require("dotenv").config();
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1/bookthingapp";
// mongoose.connect("mongodb://127.0.0.1/bookthingapp");
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Book.deleteMany({});

  //   for (let i = 0; i < books.bbe.length; i++) {
  for (let i = 0; i < books.bbe.length; i++) {
    const book = new Book({
      title: `${books.bbe[i].title}`,
      author: `${books.bbe[i].author}`,
      avgRating: `${books.bbe[i].rating}`,
      genre: `${books.bbe[i].genres}`,
      image: `${books.bbe[i].coverImg}`,
      description: `${books.bbe[i].description}`,
      series: `${books.bbe[i].series}`,
      pages: `${books.bbe[i].pages}`,
      awards: `${books.bbe[i].awards}`,
      year: `${books.bbe[i].publishDate}`,
      liked: `${books.bbe[i].likedPercent}`,
    });
    await book.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
