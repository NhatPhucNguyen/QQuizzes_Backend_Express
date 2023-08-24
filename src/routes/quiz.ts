import express, { Request } from "express";
import verifyJWT from "../middleware/verifyJWT";
import * as quizController from "../controllers/quiz";
import { verifyUser } from "../middleware/verifyUser";
const quizRouter = express.Router({ mergeParams: true });

quizRouter.use(verifyJWT);
quizRouter.use(verifyUser);
quizRouter.post("/create", quizController.quizCreate);
quizRouter.get("/get/:quizId", quizController.getSingleQuiz);
quizRouter.get("/admin/getAll", quizController.getOwnedQuizzes);
quizRouter.get("/user/getAll", quizController.getPublicQuizzes);
quizRouter.patch("/update/:name", quizController.updateQuiz);
quizRouter.delete("/delete/:name", quizController.deleteQuiz);
export default quizRouter;
