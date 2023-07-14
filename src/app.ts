import { Express } from "express";
import express from "express";
import "dotenv/config";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import verifyJWT from "./middleware/verifyJWT";
const app: Express = express();
//PORT config
const PORT = process.env.PORT || 5000;
//connect to mongodb
const mongoString = process.env.DATABASE_URI as string;
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (err) => {
    console.log(err);
});
database.once("connected", () => {
    console.log("Connected to database...");
});
//middleware setup
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//routers setup
app.use("/auth", authRouter);
app.get("/quizzes", verifyJWT, (req, res) => {
    res.sendStatus(200);
});

//response errors other routes
app.get("*", (req, res) => {
    res.sendStatus(404);
});

//Run server
app.listen(PORT, () => {
    console.log("Sever is listening on port:", PORT);
});
