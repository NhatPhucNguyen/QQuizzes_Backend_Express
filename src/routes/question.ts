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
questionRouter.post("/question/create", questionControllers.createQuestion);
//get all questions from a quiz
questionRouter.get(
    "/get/questions/getAll",
    questionControllers.getAllQuestions
);
//get all questions from a quiz belong to user
questionRouter.get(
    "/get/admin/questions/getAll",
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
questionRouter.get(
    "/delete/question/:questionId",
    questionControllers.deleteQuestion
);
questionRouter.post(
    "/question/:questionId/update",
    questionControllers.updateQuestion
);
export default questionRouter;
