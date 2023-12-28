import mongoose from "mongoose";
import { IQuestion, ISelection } from "../interfaces/db_interfaces";
import Quiz from "../models/quiz";
const questionSchema = new mongoose.Schema<IQuestion>(
    {
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
    },
    {
        collection: "questions",
        timestamps: true,
    }
);

questionSchema.pre("save", async function (this, next) {
    try {
        const questions = await mongoose
            .model("Question", questionSchema)
            .find({ quizId: this.quizId });
        this.questionNumber = questions.length + 1;
        next();
    } catch (error) {
        if (error) {
            return next(error as mongoose.CallbackError);
        }
    }
});
export default mongoose.model("Question", questionSchema);
