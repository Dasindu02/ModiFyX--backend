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
    console.log("Registration attempt:", req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { fullName, email, password } = req.body;

    // Check if user already exists (additional check)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      password
    });

    console.log("User created successfully:", user.email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email
        }
      }
    });
  } catch (err) {
    console.error("Registration error details:", err);
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already exists" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// LOGIN
// LOGIN
export const login = async (req, res) => {
  try {
    // === CORS headers ===
    res.setHeader("Access-Control-Allow-Origin", "https://www.modifyx.click"); // your frontend domain
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight request
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // === Existing login code ===
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg 
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const previousLogin = user.lastLogin;

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        age: user.age,
        district: user.district,
        vehicleModel: user.vehicleModel,
        registrationNo: user.registrationNo,
        lastLogin: previousLogin
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error during login" 
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return res.status(500).json({ message: "Server error", error });
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
