import { NextFunction, Request, Response } from "express";
import Quiz from "../models/quiz";
import User from "../models/user";
import Player from "../models/player";
import { IPlayer, IAttempt } from "../interfaces/db_interfaces";
//increase attempts and pre-set the score and time completed
export const userPlay = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { quizId } = req.params;
    const userId = req.userId as string;
    const requirementOfQuantity = 10;
    try {
        //can not play quiz if number questions not satisfy
        if ((res.locals.foundQuiz.quantity as number) < requirementOfQuantity) {
            return res
                .status(406)
                .json({ message: "Not allowed to be played." });
        }
        //to check if user are testing this quiz
        if (!res.locals.isOwner) {
            const foundPlayer = await Player.findOne({
                $and: [{ userId: userId }, { quizParticipated: quizId }],
            });
            //check if user already participated this quiz
            if (!foundPlayer) {
                const playerToAdd = new Player({
                    userId: userId,
                    quizParticipated: quizId,
                    attempts: [],
                });
                await playerToAdd.save();
            }
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
//save the result
export const handleResult = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const userId = req.userId;
    const result: IAttempt = req.body;
    if (
        result.correctAnswers === undefined ||
        result.point === undefined ||
        result.timeCompleted === undefined
    ) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        //not update result when user preview the quiz
        if (res.locals.isOwner) {
            return res.status(202).json({ message: "The quiz was tested." });
        }
        const foundPlayer = await Player.findOne({
            $and: [{ userId: userId }, { quizParticipated: quizId }],
        });

        if (!foundPlayer) {
            return res
                .status(404)
                .json({ message: "Player are not participated in the quiz." });
        }
        const prevAttempts = foundPlayer.attempts;
        //delete last attempt when user does not play any question
        const questionCountedLimit = 0;
        if (
            result.questionsCompleted &&
            result.questionsCompleted <= questionCountedLimit
        ) {
            return res
                .status(202)
                .json({ message: "The result is not counted." });
        }
        prevAttempts.push(result);
        await Player.findOneAndUpdate(
            { $and: [{ userId: userId }, { quizParticipated: quizId }] },
            { attempts: prevAttempts }
        );
        return res
            .status(200)
            .json({ message: "Result successfully updated." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
//get all attempts of current player in the quiz
export const getPlayerAttempts = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const userId = req.userId;
    try {
        const foundPlayer = await Player.findOne({
            $and: [{ userId: userId }, { quizParticipated: quizId }],
        });
        if (!foundPlayer) {
            return res
                .status(404)
                .json({ message: "Player are not participated in the quiz." });
        }
        return res.status(200).json({ attempts: foundPlayer.attempts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
