import { body, validationResult } from "express-validator";
import User from "../models/User.js";

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
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid credentials" });

    res.json({
      success: true,
      message: "Login successful",
      data: { user }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
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
