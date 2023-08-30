import { Request, Response } from "express";
import Quiz from "../models/quiz";
import { IQuiz } from "../interfaces/db_interfaces";
import Question from "../models/question";

//create a Quiz
export const quizCreate = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const newQuiz = req.body as IQuiz;
        if (!newQuiz.quizName || !newQuiz.topic) {
            return res.status(400).json({
                message: "Missing required fields.",
            });
        }
        const duplicatedQuiz = await Quiz.findOne({
            $and: [{ userId: userId }, { quizName: newQuiz.quizName }],
        });
        if (duplicatedQuiz) {
            return res.status(409).json({ message: "Quiz already existed." });
        }
        const quizToAdd = new Quiz({
            ...newQuiz,
            userId: userId,
        });
        await quizToAdd.save();
        return res.status(200).json({
            message: "Quiz created successfully.",
            quizId: quizToAdd._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong.",
        });
    }
};
//get single public quiz
export const getSingleQuiz = async (req: Request, res: Response) => {
    const quizId = req.params.quizId;
    try {
        const foundQuiz = await Quiz.findById(quizId);
        if (!foundQuiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        return res.status(200).json(foundQuiz);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
//get all quizzes belong to current user
export const getOwnedQuizzes = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const foundQuizzes = await Quiz.find({ userId });
        return res.status(200).json(foundQuizzes);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
//get all quizzes not belong to current user
export const getPublicQuizzes = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        //only get quiz has more than one question (playable)
        const foundQuizzes = await Quiz.find({
            $and: [{ userId: { $ne: userId } }, { quantity: { $gt: 9 } }],
        });
        return res.status(200).json(foundQuizzes);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
//update a quiz
export const updateQuiz = async (req: Request, res: Response) => {
    const userId = req.userId;
    const quizId = req.params.quizId;
    try {
        const newQuiz = req.body as IQuiz;
        if (!newQuiz.quizName || !newQuiz.topic) {
            return res.status(400).json({
                message: "Missing required fields.",
            });
        }
        await Quiz.findOneAndUpdate(
            {
                $and: [{ userId: userId }, { _id: quizId }],
            },
            { ...newQuiz }
        );
        return res.status(200).json("Quiz is successfully update.");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
//delete a quiz
export const deleteQuiz = async (req: Request, res: Response) => {
    const userId = req.userId;
    const quizId = req.params.quizId;
    try {
        const deletedQuiz = await Quiz.findOneAndDelete({
            $and: [{ userId }, { _id: quizId }],
        });
        if (!deletedQuiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        await Question.deleteMany({ quizId: deletedQuiz._id });
        return res
            .status(200)
            .json({ message: "Quiz is deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
