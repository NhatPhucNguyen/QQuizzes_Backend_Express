import { Request, Response } from "express";
import { IQuestion, ISelection } from "../interfaces/db_interfaces";
import Question from "../models/question";
//create a question
export const createQuestion = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const newQuestion: IQuestion = { ...req.body, quizId };
    if (
        !newQuestion.question ||
        !newQuestion.selections ||
        newQuestion.selections.length < 4
    ) {
        return res.status(400).json({ message: "Missing required fields." });
    }
    try {
        //check if all selections are valid
        let onlyOneTrue = 0;
        newQuestion.selections.forEach((selection: ISelection) => {
            if (!selection.desc) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields." });
            }
            if (selection.isTrue) {
                onlyOneTrue++;
            }
        });
        //selection array must have at least 4 selections, only one of them is true
        if (onlyOneTrue !== 1) {
            return res
                .status(400)
                .json({ message: "Must be only one selection is true." });
        }
        const questionToAdd = new Question({
            ...newQuestion,
        });
        await questionToAdd.save();
        return res.status(200).json({ message: "Question added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
//get all questions
export const getAllQuestions = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    try {
        const questions = await Question.find({ quizId: quizId });
        return res.status(200).json(questions);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
