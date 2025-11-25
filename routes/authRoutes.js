import express from "express";
import {
  register,
  login,
  getMe,
  getUsers,
  registerValidation,
  loginValidation,
  updateProfile
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", getMe);
router.get("/users", getUsers);
router.put("/update-profile/:id", updateProfile);


export default router;
