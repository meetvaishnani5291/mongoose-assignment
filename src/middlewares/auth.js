const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

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
    next(new Error("Please Authenticate!"));
  }
};

module.exports = auth;
