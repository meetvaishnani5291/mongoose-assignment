const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const e = require("express");

const auth = async (req, res, next) => {
  try {
    const token = req.header("authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne(
      { _id: decoded.id },
      {
        password: 0,
        __v: 0,
      }
    );

    if (!user) throw "User not found";
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorised ,authetication failed",
    });
  }
};

module.exports = auth;
