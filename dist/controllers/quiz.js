"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuiz = exports.updateQuiz = exports.getPublicQuizzes = exports.getOwnedQuizzes = exports.getSingleQuiz = exports.quizCreate = void 0;
const quiz_1 = __importDefault(require("../models/quiz"));
const mongoose_1 = require("mongoose");
//create a Quiz
const quizCreate = async (req, res) => {
    const userId = req.userId;
    try {
        const newQuiz = req.body;
        if (!newQuiz.quizName || !newQuiz.topic) {
            return res.status(400).json({
                message: "Missing required fields.",
            });
        }
        const duplicatedQuiz = await quiz_1.default.findOne({
            $and: [{ userId: userId }, { quizName: newQuiz.quizName }],
        });
        if (duplicatedQuiz) {
            return res.status(409).json({ message: "Quiz already existed." });
        }
        const quizToAdd = new quiz_1.default({
            ...newQuiz,
            userId: userId,
        });
        await quizToAdd.save();
        return res.status(200).json(quizToAdd);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong.",
        });
    }
};
exports.quizCreate = quizCreate;
//get single public quiz
const getSingleQuiz = async (req, res) => {
    const quizId = req.params.quizId;
    if (!mongoose_1.Types.ObjectId.isValid(quizId)) {
        return res.status(404).json({ message: "Quiz Id is not valid" });
    }
    try {
        const foundQuiz = await quiz_1.default.findById(quizId);
        if (!foundQuiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        return res.status(200).json(foundQuiz);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.getSingleQuiz = getSingleQuiz;
//get all quizzes belong to current user
const getOwnedQuizzes = async (req, res) => {
    const userId = req.userId;
    try {
        const foundQuizzes = await quiz_1.default.find({ userId }).sort({
            updatedAt: -1,
        });
        return res.status(200).json(foundQuizzes);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.getOwnedQuizzes = getOwnedQuizzes;
//get all quizzes not belong to current user
const getPublicQuizzes = async (req, res) => {
    const userId = req.userId;
    const minNumberOfQuestions = 10;
    const maxNumberOfQuestions = 100;
    const { minQuantity, maxQuantity, levels, topicName, sort, key } = req.query;
    const levelRange = levels && typeof levels === "string"
        ? levels
            .split("%2C")[0]
            .split(",")
            .map((level) => level ? level[0].toUpperCase() + level.slice(1) : level)
        : ["Basic", "Medium", "Hard"];
    const sortQuery = typeof sort === "string" && sort === "mostPlays"
        ? "-numberOfPlays"
        : "updatedAt";
    if (Number(minQuantity) < minNumberOfQuestions ||
        Number(maxQuantity) < minNumberOfQuestions) {
        return res.status(406).json({
            message: `Min quantity or max quantity must be greater than ${minNumberOfQuestions}`,
        });
    }
    try {
        //only get quiz has equal or more than 10 question (playable)
        const foundQuizzes = await quiz_1.default.find({
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.getPublicQuizzes = getPublicQuizzes;
//update a quiz
const updateQuiz = async (req, res) => {
    const userId = req.userId;
    const quizId = req.params.quizId;
    if (!mongoose_1.Types.ObjectId.isValid(quizId)) {
        return res.status(404).json({ message: "Quiz Id is not valid" });
    }
    try {
        const newQuiz = req.body;
        if (!newQuiz.quizName || !newQuiz.topic) {
            return res.status(400).json({
                message: "Missing required fields.",
            });
        }
        const duplicatedQuiz = await quiz_1.default.findOne({
            $and: [{ userId: userId }, { quizName: newQuiz.quizName }],
        });
        if (duplicatedQuiz && duplicatedQuiz._id.toString() !== quizId) {
            return res
                .status(409)
                .json({ message: "Quiz name already existed." });
        }
        const updatedQuiz = await quiz_1.default.findOneAndUpdate({
            $and: [{ userId: userId }, { _id: quizId }],
        }, { ...newQuiz });
        return res.status(200).json(updatedQuiz);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.updateQuiz = updateQuiz;
//delete a quiz
const deleteQuiz = async (req, res) => {
    const userId = req.userId;
    const quizId = req.params.quizId;
    try {
        const deletedQuiz = await quiz_1.default.findOneAndDelete({
            $and: [{ userId }, { _id: quizId }],
        });
        if (!deletedQuiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        return res
            .status(200)
            .json({ message: "Quiz is deleted successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.deleteQuiz = deleteQuiz;
