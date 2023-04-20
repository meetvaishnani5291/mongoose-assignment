const express = require("express");
const morgan = require("morgan");

require("dotenv").config();

const userRoutes = require("../src/routes/user.route");
const postRoutes = require("../src/routes/post.route");

const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

module.exports = app;
