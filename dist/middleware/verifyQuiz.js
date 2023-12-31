"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyQuiz = void 0;
const quiz_1 = __importDefault(require("../models/quiz"));
const mongoose_1 = require("mongoose");
const verifyQuiz = async (req, res, next) => {
    const quizId = req.params.quizId;
    if (!mongoose_1.Types.ObjectId.isValid(quizId)) {
        return res.status(404).json({ message: "Quiz Id is not valid" });
    }
    try {
        const foundQuiz = await quiz_1.default.findById(quizId);
        if (!foundQuiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        else {
            res.locals.foundQuiz = foundQuiz;
        }
        //check if current user created this quiz
        if (foundQuiz.userId === req.userId) {
            res.locals.isOwner = true;
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.verifyQuiz = verifyQuiz;
