const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const auth = async (req, res, next) => {
  try {
    const token = req.header("authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(401).json({ error: "Please Authenticate!" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
