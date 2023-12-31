"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.updateQuestion = exports.getAllQuestions = exports.createQuestion = void 0;
const question_1 = __importDefault(require("../models/question"));
const quiz_1 = __importDefault(require("../models/quiz"));
const quizUpdater_1 = __importDefault(require("../utils/quizUpdater"));
const mongoose_1 = require("mongoose");
//create a question
const createQuestion = async (req, res) => {
    const { quizId } = req.params;
    const selectionsNumberLimit = 4;
    if (!mongoose_1.Types.ObjectId.isValid(quizId)) {
        return res.status(404).json({ message: "Quiz Id is not valid" });
    }
    const newQuestion = { ...req.body, quizId };
    if (!newQuestion.question ||
        !newQuestion.selections ||
        newQuestion.selections.length < selectionsNumberLimit) {
        return res.status(400).json({ message: "Missing required fields." });
    }
    try {
        //check if all selections are valid
        let onlyOneTrue = 0;
        let isValid = true;
        newQuestion.selections.forEach((selection) => {
            if (!selection.desc) {
                isValid = false;
            }
            if (selection.isTrue) {
                onlyOneTrue++;
            }
        });
        if (!isValid) {
            return res
                .status(400)
                .json({ message: "Missing required fields." });
        }
        //selection array must have at least 4 selections, only one of them is true
        if (onlyOneTrue !== 1) {
            return res
                .status(400)
                .json({ message: "Must be only one selection is true." });
        }
        const questionToAdd = new question_1.default({
            ...newQuestion,
        });
        await questionToAdd.save();
        await quiz_1.default.findByIdAndUpdate(quizId, {
            $inc: {
                quantity: 1,
                totalPoints: questionToAdd.point,
                timeLimit: questionToAdd.timeLimit,
            },
        });
        return res.status(200).json({ message: "Question added successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.createQuestion = createQuestion;
//get all questions
const getAllQuestions = async (req, res) => {
    const { quizId } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(quizId)) {
        return res.status(404).json({ message: "Quiz Id is not valid" });
    }
    try {
        const questions = await question_1.default.find({ quizId: quizId });
        return res.status(200).json(questions);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.getAllQuestions = getAllQuestions;
//update question
const updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(quizId) || !mongoose_1.Types.ObjectId.isValid(questionId)) {
        return res.status(404).json({ message: "Quiz or question Id is not valid" });
    }
    const questionToUpdate = req.body;
    if (!questionToUpdate.question ||
        !questionToUpdate.selections ||
        questionToUpdate.selections.length < 4) {
        return res.status(400).json({ message: "Missing required fields." });
    }
    try {
        if (!res.locals.isOwner) {
            return res
                .status(403)
                .json({ message: "No permission to update this question" });
        }
        //check if all selections are valid
        let onlyOneTrue = 0;
        let isValid = true;
        questionToUpdate.selections.forEach((selection) => {
            if (!selection.desc) {
                isValid = false;
            }
            if (selection.isTrue) {
                onlyOneTrue++;
            }
        });
        if (!isValid) {
            return res
                .status(400)
                .json({ message: "Missing required fields." });
        }
        //selection array must have at least 4 selections, only one of them is true
        if (onlyOneTrue !== 1) {
            return res
                .status(400)
                .json({ message: "Must be only one selection is true." });
        }
        //save updated document
        const updatedQuestion = await question_1.default.findByIdAndUpdate(questionId, {
            ...questionToUpdate,
        });
        if (updatedQuestion) {
            await (0, quizUpdater_1.default)(quizId);
            return res
                .status(200)
                .json({ message: "Question updated successfully" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.updateQuestion = updateQuestion;
//delete question
const deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(quizId) || !mongoose_1.Types.ObjectId.isValid(questionId)) {
        return res.status(404).json({ message: "Quiz or question Id is not valid" });
    }
    try {
        if (!res.locals.isOwner) {
            return res
                .status(403)
                .json({ message: "No permission to delete this question" });
        }
        const deletedQuestion = await question_1.default.findByIdAndDelete(questionId);
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question Not found" });
        }
        await question_1.default.updateMany({
            $and: [
                { quizId: quizId },
                { questionNumber: { $gt: deletedQuestion.questionNumber } },
            ],
        }, { $inc: { questionNumber: -1 } });
        await quiz_1.default.findByIdAndUpdate(quizId, { $inc: { quantity: -1 } });
        await (0, quizUpdater_1.default)(quizId);
        return res
            .status(200)
            .json({ message: "Question deleted successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.deleteQuestion = deleteQuestion;
