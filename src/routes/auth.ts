import express from "express";
import * as authControllers from "../controllers/auth";
import verifyJWT from "../middleware/verifyJWT";
const authRouter = express.Router();
authRouter.get("/", verifyJWT, (req, res) => {
    res.sendStatus(200);
});
authRouter.post("/register", authControllers.handleRegister);
authRouter.post("/login", authControllers.handleLogin);
authRouter.get("/refreshToken", authControllers.handleRefreshToken);
authRouter.get("/logout", authControllers.handleLogout);
export default authRouter;
