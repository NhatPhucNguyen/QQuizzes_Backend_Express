import { Request, Response } from "express";
import Quiz from "../models/quiz";
import { IQuiz } from "../interfaces/db_interfaces";
import Question from "../models/question";

export const quizCreate = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const newQuiz = req.body as IQuiz;
        console.log(newQuiz);
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

export const updateQuiz = async (req: Request, res: Response) => {
    const userId = req.userId;
    const name = req.params.name;
    try {
        const newQuiz = req.body as IQuiz;
        if (!newQuiz.quizName || !newQuiz.topic) {
            return res.status(400).json({
                message: "Missing required fields.",
            });
        }
        await Quiz.findOneAndUpdate(
            {
                $and: [{ userId: userId }, { quizName: name }],
            },
            { ...newQuiz }
        );
        return res.status(200).json("Quiz is successfully update.");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const deleteQuiz = async (req: Request, res: Response) => {
    const userId = req.userId;
    const name = req.params.name;
    try {
        const deletedQuiz = await Quiz.findOneAndDelete({
            $and: [{ userId }, { quizName: name }],
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
