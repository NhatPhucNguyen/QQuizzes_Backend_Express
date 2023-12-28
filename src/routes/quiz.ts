import express, { Request } from "express";
import verifyJWT from "../middleware/verifyJWT";
import * as quizController from "../controllers/quiz";
import { verifyUser } from "../middleware/verifyUser";
const quizRouter = express.Router({ mergeParams: true });

quizRouter.use(verifyJWT);
quizRouter.use(verifyUser);
quizRouter.post("/", quizController.quizCreate);
quizRouter.get("/admin", quizController.getOwnedQuizzes);
quizRouter.get("/public", quizController.getPublicQuizzes);
quizRouter.get("/public/:topicName",quizController.getPublicQuizzesByTopic);
quizRouter.get("/:quizId", quizController.getSingleQuiz);
quizRouter.put("/:quizId", quizController.updateQuiz);
quizRouter.delete("/:quizId", quizController.deleteQuiz);
export default quizRouter;
