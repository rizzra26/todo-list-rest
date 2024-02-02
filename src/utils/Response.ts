import { Response } from "express";

export default (res: Response, statusCode: number, isSuccess: boolean, message: string, results?: any) => {
    if (results) {
        return res.status(statusCode).json({
            status: statusCode,
            success: isSuccess,
            message,
            results
        })
    } else {
        return res.status(statusCode).json({
            status: statusCode,
            success: isSuccess,
            message,
        })
    }
}