const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc   Register new user
// @route  POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Login user
// @route  POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // need to explicitly select password since schema hides it by default
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get current logged in user
// @route  GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    // req.user is already set by the protect middleware
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

// @desc   Logout user
// @route  POST /api/auth/logout
// NOTE: since we're using JWT (stateless), logout is basically handled
// on the client by deleting the token. This endpoint exists to match
// the spec / give the frontend something to call.
const logoutUser = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, getMe, logoutUser };
