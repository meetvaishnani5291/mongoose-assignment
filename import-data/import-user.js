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

  const password = await bcrypt.hash("12345678", 10);

  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then(async (users) => {
      console.log(users);
      users.forEach((user) => {
        user._id = user.id;
        delete user.id;
        user.password = password;
      });
      console.log(users);
      console.log(await User.insertMany(users));
    });
})();
