const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Book = require("../models/book");
const passportLocalMongoose = require("passport-local-mongoose");

const ShelvedBookSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
  isShelved: {
    type: Boolean,
    default: false,
  },
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: String,
  firstname: String,
  lastname: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  bookshelf: [ShelvedBookSchema],
  isAdmin: { type: Boolean, default: false },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
