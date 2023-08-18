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
    try {
        //to check if user are testing this quiz
        const foundQuiz = await Quiz.findOne({
            $and: [{ _id: quizId }, { userId: userId }],
        });
        if (!foundQuiz) {
            const foundPlayer = await Player.findOne({
                $and: [{ userId: userId }, { quizParticipated: quizId }],
            });
            //check if user already participated this quiz
            if (!foundPlayer) {
                const playerToAdd = new Player({
                    userId: userId,
                    quizParticipated: quizId,
                    attempts: [
                        {
                            score: 0,
                            timeCompleted: 0,
                            questionsCompleted: 0,
                        },
                    ],
                });
                await playerToAdd.save();
            } else {
                //check if user already played this quiz before
                const newAttempts: IAttempt[] = [
                    ...foundPlayer.attempts,
                    { score: 0, timeCompleted: 0, questionsCompleted: 0 },
                ];
                await Player.findOneAndUpdate(
                    {
                        $and: [
                            { userId: userId },
                            { quizParticipated: quizId },
                        ],
                    },
                    { attempts: newAttempts }
                );
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
    if (!result.questionsCompleted || !result.score || !result.timeCompleted) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const foundPlayer = await Player.findOne({
            $and: [{ userId: userId }, { quizParticipated: quizId }],
        });
        if (!foundPlayer) {
            return res
                .status(404)
                .json({ message: "Player are not joining the quiz." });
        }
        const prevAttempts = foundPlayer.attempts;
        prevAttempts[prevAttempts.length - 1] = result;
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
