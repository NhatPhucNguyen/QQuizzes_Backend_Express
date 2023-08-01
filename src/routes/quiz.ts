import express, { Request } from "express";
import verifyJWT from "../middleware/verifyJWT";
import * as quizController from "../controllers/quiz";
import { verifyUser } from "../middleware/verifyUser";
const quizRouter = express.Router();

quizRouter.use(verifyJWT);
quizRouter.use(verifyUser);
quizRouter.post("/create", quizController.quizCreate);
quizRouter.get("/get/:name", quizController.getSingleQuiz);
quizRouter.get(
    "/myquizzes/getAll",
    quizController.getOwnedQuizzes
);
quizRouter.patch("/update/:name", quizController.updateQuiz);
quizRouter.delete("/delete/:name", quizController.deleteQuiz);
export default quizRouter;
