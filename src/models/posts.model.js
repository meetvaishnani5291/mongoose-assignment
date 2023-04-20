const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    // unique: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

postSchema.index(
  { body: "text", title: "text" },
  {
    weight: {
      title: 10,
      body: 5,
    },
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
