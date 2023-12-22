import express from "express";
import * as playerController from "../controllers/player";
import * as questionControllers from "../controllers/question";
import { verifyQuiz } from "../middleware/verifyQuiz";
import { verifyUser } from "../middleware/verifyUser";
const playerRouter = express.Router({ mergeParams: true });
playerRouter.use(verifyUser);
playerRouter.use(verifyQuiz);
playerRouter.get(
    "/",
    playerController.userPlay,
    questionControllers.getAllQuestions
);
playerRouter.put("/result", playerController.handleResult);
playerRouter.get("/result", playerController.getPlayerResult);
playerRouter.get(
    "/playersParticipated",
    playerController.getPlayerParticipated
);
export default playerRouter;
