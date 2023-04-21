const User = require("../models/users.model");
const Post = require("../models/posts.model");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { userValidationSchema } = require("../utils/validation");

const loginUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    Joi.assert(email, Joi.string().email().required());
    Joi.assert(password, Joi.string().required());

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const token = await user.generateAuthToken();
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

const addUser = async (req, res, next) => {
  try {
    const newUser = req.body.user;
    Joi.assert({ ...newUser }, userValidationSchema);
    const user = await User.create(newUser);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  res.status(200).json({ data: req.user });
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    await Post.deleteMany({ userId });
    await User.deleteOne({ _id: userId });
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addUser,
  getUser,
  deleteUser,
  loginUser,
};
