import express, { Request, Response } from "express";

// Config
import { signUpValidator, signInValidator } from "../config/Validation";

// Controllers
import { signUp, signIn } from "../controllers/auth";

// define router
const router = express.Router();

router.post("/signup", signUpValidator, signUp);
router.post("/signin", signInValidator, signIn);

export default router;