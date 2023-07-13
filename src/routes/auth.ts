import express from "express";
import * as authControllers from "../controllers/auth";
const authRouter = express.Router();
authRouter.get("/", (req, res) => {
    res.sendStatus(200);
});
authRouter.post("/register", authControllers.handleRegister);
authRouter.post("/login", authControllers.handleLogin);
export default authRouter;
