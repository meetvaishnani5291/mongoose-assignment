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
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
