import express from "express";
import * as questionControllers from "../controllers/question";
import verifyJWT from "../middleware/verifyJWT";
import { verifyQuiz } from "../middleware/verifyQuiz";
import playerRouter from "./player";

const questionRouter = express.Router({ mergeParams: true });
questionRouter.use(verifyJWT);
questionRouter.use(verifyQuiz);
//access play router
questionRouter.use("/play", playerRouter, questionControllers.getAllQuestions);
//create a question
questionRouter.post("/", questionControllers.createQuestion);
//get all questions from a quiz
questionRouter.get(
    "/",
    questionControllers.getAllQuestions
);
//get all questions from a quiz belong to user
questionRouter.get(
    "/private",
    (req, res, next) => {
        if (!res.locals.isOwner) {
            return res.status(401).json({
                message: "No permission to access this quiz",
            });
        }
        next();
    },
    questionControllers.getAllQuestions
);
questionRouter.delete(
    "/:questionId",
    questionControllers.deleteQuestion
);
questionRouter.put(
    "/:questionId",
    questionControllers.updateQuestion
);
export default questionRouter;
