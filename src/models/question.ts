import mongoose from "mongoose";
import { IQuestion, ISelection } from "../interfaces/db_interfaces";

const questionSchema = new mongoose.Schema<IQuestion>(
    {
        questionNumber: {
            type: "number",
            required: true,
        },
        question: {
            type: "string",
            required: true,
        },
        desc: {
            type: "string",
        },
        answer: {
            required: true,
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
    },
    {
        collection: "questions",
    }
);

export default mongoose.model("Question", questionSchema);
