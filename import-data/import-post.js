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

  const User = require("../src/models/users.model");
  const Post = require("../src/models/posts.model");

  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then(async (posts) => {
      console.log(posts);
      posts.forEach((post) => {
        post._id = post.id;
        delete post.id;
      });
      console.log(posts);
      console.log(await Post.insertMany(posts));
    });
})();
