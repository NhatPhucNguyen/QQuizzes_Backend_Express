import { NextFunction, Request, Response } from "express";
import Quiz from "../models/quiz";

export const verifyQuiz = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const quizId = req.params.quizId;
    try {
        const foundQuiz = await Quiz.findById(quizId);
        if (!foundQuiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
