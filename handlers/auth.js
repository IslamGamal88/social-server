const db = require("../models");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/keys").SECRET_KEY;
exports.signin = async function(req, res, next) {
  try {
    let user = await db.User.findOne({ email: req.body.email });
    let { id, username, profileImageUrl } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      let token = jwt.sign({ id, username, profileImageUrl }, secretKey);
      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token
      });
    } else {
      return next({
        status: 400,
        message: "Invalid Email or Password"
      });
    }
  } catch (error) {
    return next({
      status: 400,
      message: "Invalid Email or Password"
    });
  }
};

exports.signup = async function(req, res, next) {
  try {
    let user = await db.User.create(req.body);
    let { id, username, profileImageUrl } = user;
    let token = jwt.sign({ id, username, profileImageUrl }, secretKey);
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token
    });
  } catch (error) {
    if (error.code === 11000) {
      error.errmsg = "Sorry , that Username and/or Email is already taken";
    }
    return next({
      status: 400,
      message: error.errmsg
    });
  }
};
