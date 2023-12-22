import { NextFunction, Request, Response } from "express";
import Quiz from "../models/quiz";
import User from "../models/user";
import Player from "../models/player";
import { IPlayer, IResult } from "../interfaces/db_interfaces";
//increase attempts and pre-set the score and time completed
export const userPlay = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { quizId } = req.params;
    const userId = req.userId as string;
    const displayName = req.displayName;
    const requirementOfQuantity = 10;
    try {
        //can not play quiz if number questions not satisfy
        if ((res.locals.foundQuiz.quantity as number) < requirementOfQuantity) {
            return res
                .status(406)
                .json({ message: "Not allowed to be played." });
        }
        //to check if user are previewing this quiz
        if (!res.locals.isOwner) {
            const foundPlayer = await Player.findOne({
                $and: [{ userId: userId }, { quizParticipated: quizId }],
            });
            //check if user already participated this quiz
            if (!foundPlayer) {
                const playerToAdd = new Player({
                    userId: userId,
                    quizParticipated: quizId,
                    displayName: displayName,
                    result: {} as IResult,
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
    const result: IResult = req.body;
    if (
        result.correctAnswers === undefined ||
        result.highestPoint === undefined ||
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
        //not saving result when user does not play any question
        const questionCountedLimit = 0;
        if (
            result.questionsCompleted &&
            result.questionsCompleted <= questionCountedLimit
        ) {
            return res
                .status(202)
                .json({ message: "The result is not counted." });
        }

        //save result if this is first time user play this quiz
        if (!foundPlayer.result) {
            foundPlayer.result = { ...result, attempts: 1 };
            await foundPlayer.save();
            return res
                .status(200)
                .json({ message: "Result successfully updated." });
        }
        //save result if this is highest point user get
        if (result.highestPoint > foundPlayer.result.highestPoint) {
            foundPlayer.result = {
                ...result,
                attempts: foundPlayer.result.attempts + 1,
            } as IResult;
        } else {
            foundPlayer.result = {
                ...foundPlayer.result,
                attempts: foundPlayer.result.attempts + 1,
            } as IResult;
        }
        await foundPlayer.save();
        return res
            .status(200)
            .json({ message: "Result successfully updated." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
//get all attempts of current player in the quiz
export const getPlayerResult = async (req: Request, res: Response) => {
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
        return res.status(200).json({ result: foundPlayer.result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

//get all users played this quiz
export const getPlayerParticipated = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const { offset } = req.query;
    const limit: number = isNaN(Number(offset)) ? 0 : Number(offset);
    try {
        //get all player based on: highest point > time completed > attempts with offset
        const playersList = await Player.find({
            quizParticipated: quizId,
        })
            .sort({
                "result.highestPoint": -1,
                "result.timeCompleted": 1,
                "result.attempts": 1,
            })
            .limit(limit);
        return res.status(200).json(playersList);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
