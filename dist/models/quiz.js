"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quizSchema = new mongoose_1.default.Schema({
    quizName: {
        type: "string",
        required: true,
    },
    topic: {
        type: "string",
    },
    level: {
        type: "string",
        default: "basic",
    },
    quantity: {
        type: "number",
        default: 0,
    },
    timeLimit: {
        type: "number",
        default: 0,
    },
    totalPoints: {
        type: "number",
        default: 0,
    },
    userId: {
        type: "string",
        required: true,
    },
    numberOfPlays: {
        type: "number",
        default: 0,
    },
}, {
    collection: "quiz",
    timestamps: true,
});
exports.default = mongoose_1.default.model("Quiz", quizSchema);
