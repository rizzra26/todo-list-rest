import { body } from "express-validator"

export const signUpValidator = [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long")
]

export const signInValidator = [
    body("email").isEmail().withMessage("Email is not valid"),
]