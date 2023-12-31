"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const question_1 = __importDefault(require("../models/question"));
const quiz_1 = __importDefault(require("../models/quiz"));
//update total point and time limit when question data changes
const quizUpdater = async (quizId) => {
    const questions = await question_1.default.find({ quizId: quizId });
    const totalPoints = questions.reduce((x, question) => x + question.point, 0);
    const timeLimit = questions.reduce((x, question) => x + question.timeLimit, 0);
    console.log(timeLimit);
    await quiz_1.default.findByIdAndUpdate(quizId, {
        totalPoints: totalPoints,
        timeLimit: timeLimit,
    });
};
exports.default = quizUpdater;
