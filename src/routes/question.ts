import express from "express";
import * as questionControllers from "../controllers/question";
import verifyJWT from "../middleware/verifyJWT";
import { verifyQuiz } from "../middleware/verifyQuiz";

const questionRouter = express.Router({ mergeParams: true });
questionRouter.use(verifyJWT);
questionRouter.use(verifyQuiz);
questionRouter.post("/question/create", questionControllers.createQuestion);
questionRouter.get(
    "/get/questions/getAll",
    questionControllers.getAllQuestions
);
questionRouter.get(
    "/delete/question/:questionId",
    questionControllers.deleteQuestion
);
questionRouter.post("/question/:questionId/update",questionControllers.updateQuestion)
export default questionRouter;
