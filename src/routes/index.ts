import express, { Request, Response } from "express";

// define router
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            success: true,
            message: "Hello World!"
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Gagal!"
        })
        throw new Error(error);
    }
})

export default router;