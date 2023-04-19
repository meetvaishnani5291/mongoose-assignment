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

const createProfile = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

const viewProfile = async (req, res, next) => {
  res.status(200).json({ data: req.user });
};

const updateProfile = async (req, res, next) => {
  const allowedUpdates = ["username", "email", "password", "age"];
  const updates = Object.keys(req.body);

  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).json({ error: "Invalid Update" });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();

    res.status(200).json({ data: req.user });
  } catch (err) {
    next(err);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    await Post.deleteMany({ postedBy: req.user._id });
    await User.deleteOne({ email: req.user._id });
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProfile,
  viewProfile,
  updateProfile,
  deleteProfile,
  loginUser,
};
