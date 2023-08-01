import express from "express";
import verifyJWT from "../middleware/verifyJWT";

const questionRouter = express.Router();
questionRouter.use(verifyJWT);
questionRouter.get("/get/questions/getAll");

export default questionRouter;
