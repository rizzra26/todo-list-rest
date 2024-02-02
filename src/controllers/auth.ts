import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// utils
import response from "../utils/Response";

const Prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response) => {
    // validate body request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(res, 400, false, "Validation Error", errors.array());
    }
    try {
        // check user exist
        if (await Prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })) {
            return response(res, 400, false, "User already exist");
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        await Prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                Credential: {
                    create: {
                        identity: req.body.email,
                        credentialKey: hashedPassword,
                    }
                }
            }
        });

        return response(res, 200, true, "Thanks, your registered. please check your email to verify your account");
    } catch (error: any) {
        response(res, 500, false, error);
        throw new Error(error);
    }
}

export const signIn = async (req: Request, res: Response) => {
    // validate body request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(res, 400, false, "Validation Error", errors.array());
    }
    try {
        // check user exist and compare hashed password
        const user = await Prisma.credential.findUnique({
            where: {
                identity: req.body.email
            }
        })
        if (!user || !await bcrypt.compare(req.body.password, user.credentialKey)) {
            return response(res, 400, false, "Email or Password is wrong");
        }

        // sign token
        const token = jwt.sign({ _id: user.userId }, process.env.APP_KEY!);

        return response(res, 200, true, "Sign in successfull.", { token });
    } catch (error: any) {
        response(res, 500, false, error);
        throw new Error(error);
    }
}