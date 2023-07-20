import express, { Request, Response } from "express";
import * as authControllers from "../controllers/auth";
import verifyJWT from "../middleware/verifyJWT";
const authRouter = express.Router();
authRouter.get("/", verifyJWT, (req:Request, res) => {
    res.status(200).json({userId:req.userId})
});
authRouter.post("/register", authControllers.handleRegister);
authRouter.post("/login", authControllers.handleLogin);
authRouter.get("/refreshToken", authControllers.handleRefreshToken);
authRouter.get("/logout", authControllers.handleLogout);
export default authRouter;
