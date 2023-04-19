const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

(async function () {
  require("dotenv").config();
  const connectionString = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
  console.log(connectionString);
  await mongoose
    .connect(connectionString)
    .then(() => {
      console.log("database connected succesfully");
    })
    .catch((err) => console.log(err.message, "connection failed!"));

  const Comment = require("../src/models/comments.model");

  fetch("https://jsonplaceholder.typicode.com/comments")
    .then((response) => response.json())
    .then(async (comments) => {
      console.log(comments);
      comments.forEach((comment) => {
        comment._id = comment.id;
        delete comment.id;
        delete comment.name;
      });
      console.log(comments);
      console.log(await Comment.insertMany(comments));
    });
})();
