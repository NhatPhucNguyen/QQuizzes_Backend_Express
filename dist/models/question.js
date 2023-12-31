"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    questionNumber: {
        type: "number",
        default: 0,
    },
    question: {
        type: "string",
        required: true,
    },
    desc: {
        type: "string",
    },
    selections: {
        type: [Object],
        require: true,
    },
    point: {
        type: "number",
        required: true,
        default: 1,
    },
    timeLimit: {
        type: "number",
        required: true,
        default: 30,
    },
    quizId: {
        type: "string",
        required: true,
    },
}, {
    collection: "questions",
    timestamps: true,
});
questionSchema.pre("save", async function (next) {
    try {
        const questions = await mongoose_1.default
            .model("Question", questionSchema)
            .find({ quizId: this.quizId });
        this.questionNumber = questions.length + 1;
        next();
    }
    catch (error) {
        if (error) {
            return next(error);
        }
    }
});
exports.default = mongoose_1.default.model("Question", questionSchema);
