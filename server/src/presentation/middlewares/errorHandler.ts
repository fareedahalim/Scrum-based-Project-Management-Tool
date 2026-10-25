
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode =
        error instanceof AppError ? error.statusCode : 500;

    const message =
        statusCode === 500
            ? "Internal server error."
            : error.message;

    if (statusCode === 500) {
        console.error("Internal Server Error:", error);
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};
