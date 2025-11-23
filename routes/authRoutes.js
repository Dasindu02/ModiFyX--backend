import express from "express";
import {
  register,
  login,
  getMe,
  getUsers,
  registerValidation,
  loginValidation
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", getMe);
router.get("/users", getUsers);

export default router;
