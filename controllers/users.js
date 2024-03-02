const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CREATE NEW USER
const register = async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  try {
    const user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      isAdmin: req.body.isAdmin,
      img: req.body.img,
    });
    const saved = await user.save();
    res.status(200).json(saved);
  } catch (err) {
    next(err);
    console.log(err);
  }
};
// LOGIN
const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("wrong credentials");
    }

    const isValidated = await bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isValidated) {
      return res.status(404).json("wrong credentials");
    }

    const access_token = await jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT,
      { expiresIn: "1h" }
    );

    const { password, isAdmin, ...others } = user._doc;
    res.status(200).json({ ...others, access_token, isAdmin });
    // res.cookie("access_token", token, {
    //     httpOnly: true,
    // }).status(200).json({ ...others});
  } catch (err) {
    console.log(err);
    next(err);
  }
};
// UPDATE USER
const update = async (req, res, next) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const update = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(update);
      console.log(update);
    } catch (err) {
      next(err);
      console.log(err);
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
};
// GET ALL USERS
const allUsers = async (req, res, next) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
    console.log(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
// GET USER BY ID
const getUsersById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
// DELETE USERS
const deleteUsers = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been deleted");
  } catch (err) {
    next(err);
  }
};
module.exports = {
  allUsers,
  getUsersById,
  register,
  login,
  update,
  deleteUsers,
};
