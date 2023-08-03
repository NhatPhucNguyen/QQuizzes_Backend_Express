import mongoose from "mongoose";
import { IQuiz } from "../interfaces/db_interfaces";
import bcrypt from "bcrypt";

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
        },
        userId: {
            type: "string",
            required: true,
        },
    },
    {
        collection: "quiz",
    }
);
export default mongoose.model("Quiz", quizSchema);
