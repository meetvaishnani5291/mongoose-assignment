const mongoose = require("mongoose");
const validator = require("validator");

const commentSchema = mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    unique: true,
  },
  postId: {
    type: Number,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: (value) => {
      if (!validator.isEmail(value)) throw new Error("email is not valid!");
    },
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
