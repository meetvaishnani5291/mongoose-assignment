const User = require("../models/users.model");
const Post = require("../models/posts.model");
const bcrypt = require("bcryptjs");

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);

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
    const user = await User.create(req.body);
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
    await Post.deleteMany({ userId: req.user._id });
    await User.deleteOne({ _id: req.user._id });
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
