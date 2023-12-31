"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerParticipated = exports.getPlayerResult = exports.handleResult = exports.userPlay = void 0;
const quiz_1 = __importDefault(require("../models/quiz"));
const player_1 = __importDefault(require("../models/player"));
//increase attempts and pre-set the score and time completed
const userPlay = async (req, res) => {
    const { quizId } = req.params;
    const userId = req.userId;
    const displayName = req.displayName;
    const requirementOfQuantity = 10;
    try {
        //can not play quiz if number questions not satisfy
        if (res.locals.foundQuiz.quantity < requirementOfQuantity) {
            return res
                .status(406)
                .json({ message: "Not allowed to be played." });
        }
        //to check if user are previewing this quiz
        if (res.locals.isOwner) {
            return res.status(200).json({ message: "Previewing" });
        }
        const foundPlayer = await player_1.default.findOne({
            $and: [{ userId: userId }, { quizParticipated: quizId }],
        });
        //check if user plays this quiz in the first time
        if (!foundPlayer) {
            const playerToAdd = new player_1.default({
                userId: userId,
                quizParticipated: quizId,
                displayName: displayName,
                result: {},
            });
            await playerToAdd.save();
        }
        await quiz_1.default.findByIdAndUpdate(quizId, {
            $inc: { numberOfPlays: 1 },
        });
        return res.status(200).json({ message: "Ready to play" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.userPlay = userPlay;
//save the result
const handleResult = async (req, res) => {
    const { quizId } = req.params;
    const userId = req.userId;
    const result = req.body;
    if (result.correctAnswers === undefined ||
        result.highestPoint === undefined ||
        result.timeCompleted === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        //not update result when user preview the quiz
        if (res.locals.isOwner) {
            return res.status(202).json({ message: "The quiz was tested." });
        }
        const foundPlayer = await player_1.default.findOne({
            $and: [{ userId: userId }, { quizParticipated: quizId }],
        });
        if (!foundPlayer) {
            return res
                .status(404)
                .json({ message: "Player are not participated in the quiz." });
        }
        //not saving result when user does not play any question
        const questionCountedLimit = 0;
        if (result.questionsCompleted &&
            result.questionsCompleted <= questionCountedLimit) {
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
            };
        }
        else {
            foundPlayer.result = {
                ...foundPlayer.result,
                attempts: foundPlayer.result.attempts + 1,
            };
        }
        await foundPlayer.save();
        return res
            .status(200)
            .json({ message: "Result successfully updated." });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.handleResult = handleResult;
//get current result of player
const getPlayerResult = async (req, res) => {
    const { quizId } = req.params;
    const userId = req.userId;
    try {
        const foundPlayer = await player_1.default.findOne({
            $and: [{ userId: userId }, { quizParticipated: quizId }],
        });
        return res.status(200).json(foundPlayer);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.getPlayerResult = getPlayerResult;
//get all users played this quiz
const getPlayerParticipated = async (req, res) => {
    const { quizId } = req.params;
    const { limit } = req.query;
    const limitParam = isNaN(Number(limit)) ? 0 : Number(limit);
    try {
        //get all player based on: highest point > time completed > attempts with offset
        const playersList = await player_1.default.find({
            quizParticipated: quizId,
        })
            .sort({
            "result.highestPoint": -1,
            "result.timeCompleted": 1,
            "result.attempts": 1,
        })
            .limit(limitParam);
        return res.status(200).json(playersList);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.getPlayerParticipated = getPlayerParticipated;
