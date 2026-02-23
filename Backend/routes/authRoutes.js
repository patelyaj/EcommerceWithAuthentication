import express from "express";
import { logoutUser, registerUser } from "../controllers/authControllers.js";
import { loginUser } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout",logoutUser);

export default router;