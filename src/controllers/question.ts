import { Request, Response } from "express";
import { IQuestion, ISelection } from "../interfaces/db_interfaces";
import Question from "../models/question";
import Quiz from "../models/quiz";
import question from "../models/question";
import quizUpdater from "../utils/quizUpdater";
import { Types } from "mongoose";
//create a question
export const createQuestion = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const selectionsNumberLimit = 4;
    if (!Types.ObjectId.isValid(quizId)) {
        return res.status(404).json({ message: "Quiz Id is not valid" });
    }
    const newQuestion: IQuestion = { ...req.body, quizId };
    if (
        !newQuestion.question ||
        !newQuestion.selections ||
        newQuestion.selections.length < selectionsNumberLimit
    ) {
        return res.status(400).json({ message: "Missing required fields." });
    }
    try {
        //check if all selections are valid
        let onlyOneTrue = 0;
        let isValid = true;
        newQuestion.selections.forEach((selection: ISelection) => {
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
        const questionToAdd = new Question({
            ...newQuestion,
        });
        await questionToAdd.save();
        await Quiz.findByIdAndUpdate(quizId, {
            $inc: {
                quantity: 1,
                totalPoints: questionToAdd.point,
                timeLimit: questionToAdd.timeLimit,
            },
        });
        return res.status(200).json({ message: "Question added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
//get all questions
export const getAllQuestions = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    if (!Types.ObjectId.isValid(quizId)) {
        return res.status(404).json({ message: "Quiz Id is not valid" });
    }
    try {
        const questions = await Question.find({ quizId: quizId });
        return res.status(200).json(questions);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

//update question
export const updateQuestion = async (req: Request, res: Response) => {
    const { quizId, questionId } = req.params;
    if (!Types.ObjectId.isValid(quizId) || !Types.ObjectId.isValid(questionId)) {
        return res.status(404).json({ message: "Quiz or question Id is not valid" });
    }
    const questionToUpdate = req.body as IQuestion;
    if (
        !questionToUpdate.question ||
        !questionToUpdate.selections ||
        questionToUpdate.selections.length < 4
    ) {
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
        questionToUpdate.selections.forEach((selection: ISelection) => {
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
        const updatedQuestion = await Question.findByIdAndUpdate(questionId, {
            ...questionToUpdate,
        });        
        if (updatedQuestion) {
            await quizUpdater(quizId);
            return res
                .status(200)
                .json({ message: "Question updated successfully" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

//delete question
export const deleteQuestion = async (req: Request, res: Response) => {
    const { quizId, questionId } = req.params;
    if (!Types.ObjectId.isValid(quizId) || !Types.ObjectId.isValid(questionId)) {
        return res.status(404).json({ message: "Quiz or question Id is not valid" });
    }
    try {
        if (!res.locals.isOwner) {
            return res
                .status(403)
                .json({ message: "No permission to delete this question" });
        }
        const deletedQuestion = await Question.findByIdAndDelete(questionId);
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question Not found" });
        }
        await Question.updateMany(
            {
                $and: [
                    { quizId: quizId },
                    { questionNumber: { $gt: deletedQuestion.questionNumber } },
                ],
            },
            { $inc: { questionNumber: -1 } }
        );
        await Quiz.findByIdAndUpdate(quizId, { $inc: { quantity: -1 } });
        await quizUpdater(quizId);
        return res
            .status(200)
            .json({ message: "Question deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
