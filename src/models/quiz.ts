import mongoose from "mongoose";
import { IQuiz } from "../interfaces/db_interfaces";
const quizSchema = new mongoose.Schema<IQuiz>(
    {
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
    },
    {
        collection: "quiz",
        timestamps: true,
    }
);
export default mongoose.model("Quiz", quizSchema);
