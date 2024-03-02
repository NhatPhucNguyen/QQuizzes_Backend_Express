import { Request, Response } from "express";
import Quiz from "../models/quiz";
import Player from "../models/player";
import { IQuiz } from "../interfaces/db_interfaces";
import { Types } from "mongoose";

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
        return res.status(200).json(quizToAdd);
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
    if (!Types.ObjectId.isValid(quizId)) {
        return res.status(404).json({ message: "Quiz Id is not valid" });
    }
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
        const foundQuizzes = await Quiz.find({ userId }).sort({
            updatedAt: -1,
        });
        return res.status(200).json(foundQuizzes);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
//get all quizzes not belong to current user
export const getPublicQuizzes = async (req: Request, res: Response) => {
    const userId = req.userId;
    const minNumberOfQuestions = 10;
    const maxNumberOfQuestions = 100;
    const { minQuantity, maxQuantity, levels, topicName, sort, key } =
        req.query;
    const levelRange =
        levels && typeof levels === "string"
            ? levels
                  .split("%2C")[0]
                  .split(",")
                  .map((level) =>
                      level ? level[0].toUpperCase() + level.slice(1) : level
                  )
            : ["Basic", "Medium", "Hard"];
    const sortQuery =
        typeof sort === "string" && sort === "mostPlays"
            ? "-numberOfPlays"
            : "updatedAt";
    if (
        Number(minQuantity) < minNumberOfQuestions ||
        Number(maxQuantity) < minNumberOfQuestions
    ) {
        return res.status(406).json({
            message: `Min quantity or max quantity must be greater than ${minNumberOfQuestions}`,
        });
    }
    try {
        //only get quiz has equal or more than 10 question (playable)
        const foundQuizzes = await Quiz.find({
            $and: [
                { userId: { $ne: userId } },
                {
                    quantity: {
                        $gte: Number(minQuantity) || minNumberOfQuestions,
                        $lt: Number(maxQuantity) || maxNumberOfQuestions,
                    },
                    topic: {
                        $regex: topicName || "",
                        $options: "i",
                    },
                    level: {
                        $in: levelRange,
                    },
                    quizName: {
                        $regex: key || "",
                        $options: "i",
                    },
                },
            ],
        }).sort(sortQuery);
        return res.status(200).json(foundQuizzes);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const getQuizzesParticipated = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const foundPlayers = await Player.find({ userId: userId });
        const quizIdList = foundPlayers.map(
            (player) => player.quizParticipated
        );
        const quizzesParticipated = await Quiz.find({
            _id: { $in: quizIdList },
        });
        return res.status(200).json(quizzesParticipated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

//update a quiz
export const updateQuiz = async (req: Request, res: Response) => {
    const userId = req.userId;
    const quizId = req.params.quizId;
    if (!Types.ObjectId.isValid(quizId)) {
        return res.status(404).json({ message: "Quiz Id is not valid" });
    }
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
        if (duplicatedQuiz && duplicatedQuiz._id.toString() !== quizId) {
            return res
                .status(409)
                .json({ message: "Quiz name already existed." });
        }
        const updatedQuiz = await Quiz.findOneAndUpdate(
            {
                $and: [{ userId: userId }, { _id: quizId }],
            },
            { ...newQuiz }
        );
        return res.status(200).json(updatedQuiz);
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
        return res
            .status(200)
            .json({ message: "Quiz is deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
