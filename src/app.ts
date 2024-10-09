import { Express } from "express";
import express from "express";
import "dotenv/config";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import cors from "cors";
import quizRouter from "./routes/quiz";
import questionRouter from "./routes/question";
import playerRouter from "./routes/player";
import path from "path";
import http from "http"
import { Server } from "socket.io";
import { questionHandlers } from "./services/socket/questionHandlers";
const app: Express = express();
//PORT config
const PORT = process.env.PORT || 5000;
//connect to mongodb
const mongoString =
    process.env.DATABASE_URI_LOCAL || (process.env.DATABASE_URI as string);
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
app.use(
    cors({
        credentials: true,
        origin: true,
    })
);
//routers setup
app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/quizzes/:quizId/questions", questionRouter);
app.use("/api/quizzes/:quizId/play", playerRouter);
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.sendStatus(200);
});
app.get("/api", (req, res) => {
    res.sendStatus(200);
});
app.get("/document", (req, res) => {
    res.sendFile(path.join(__dirname,"./index.html"));
});
//response errors other routes
app.get("*", (req, res) => {
    res.status(404).json({ message: "URL not found." });
});

//create socket server
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:true
    },
});
io.on("connection",async (socket) => {
    console.log("user connected !");
    await questionHandlers(socket);
})
//run socket server
server.listen(4999);
//Run server
app.listen(PORT, () => {
    console.log("Sever is listening on port:", PORT);
});

export default app;
