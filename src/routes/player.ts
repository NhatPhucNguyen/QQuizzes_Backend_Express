import express from "express";
import * as playerController from "../controllers/player";
const playerRouter = express.Router({ mergeParams: true });

playerRouter.get("/", playerController.userPlay);
playerRouter.patch("/result", playerController.handleResult);
playerRouter.get("/get/attempts", playerController.getPlayerAttempts);
export default playerRouter;
