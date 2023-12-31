import { NextFunction, Request, Response } from "express";
import Quiz from "../models/quiz";
import { Types } from "mongoose";

export const verifyQuiz = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const quizId = req.params.quizId;
    if (!Types.ObjectId.isValid(quizId)) {
        return res.status(404).json({ message: "Quiz Id is not valid" });
    }
    try {
        const foundQuiz = await Quiz.findById(quizId);
        if (!foundQuiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        else{
            res.locals.foundQuiz = foundQuiz;
        }
        //check if current user created this quiz
        if (foundQuiz.userId === req.userId) {
            res.locals.isOwner = true;
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
