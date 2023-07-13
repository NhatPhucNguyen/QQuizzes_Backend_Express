import { Express, urlencoded } from "express";
import express from "express";
import "dotenv/config";
import morgan from "morgan";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
const app: Express = express();
const PORT = process.env.PORT || 5000;
const mongoString =
    process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/QQuizzes";
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (err) => {
    console.log(err);
});
database.once("connected", () => {
    console.log("Connected to database...");
});
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRouter);
app.get("/", (req, res) => {
    res.sendStatus(200);
});
app.listen(PORT, () => {
    console.log("Sever is listening on port:", PORT);
});
