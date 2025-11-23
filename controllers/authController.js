import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


// VALIDATIONS
export const registerValidation = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),

  body("email")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (email) => {
      const exists = await User.findOne({ email });
      if (exists) throw new Error("Email already exists");
      return true;
    }),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required")
];

// REGISTER
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const { fullName, email, password } = req.body;

    const user = await User.create({
      fullName,
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// ME
export const getMe = (req, res) => {
  res.json({ success: true, message: "User profile", data: null });
};

// ALL USERS
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json({ success: true, count: users.length, data: users });
};
