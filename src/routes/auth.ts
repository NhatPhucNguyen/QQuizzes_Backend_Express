import express from "express";

const authRouter = express.Router();
authRouter.get("/", (req, res) => {
    res.sendStatus(200);
});
// authRouter.get("/login");
// authRouter.get("/register");
export default authRouter;
