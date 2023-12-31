"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
const quiz_1 = __importDefault(require("./routes/quiz"));
const question_1 = __importDefault(require("./routes/question"));
const player_1 = __importDefault(require("./routes/player"));
const app = (0, express_1.default)();
//PORT config
const PORT = process.env.PORT || 5000;
//connect to mongodb
const mongoString = process.env.DATABASE_URI_LOCAL || process.env.DATABASE_URI;
mongoose_1.default.connect(mongoString);
const database = mongoose_1.default.connection;
database.on("error", (err) => {
    console.log(err);
});
database.once("connected", () => {
    console.log("Connected to database...");
});
//middleware setup
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5000", "http://localhost:5173"],
    credentials: true,
}));
//routers setup
app.use("/api/auth", auth_1.default);
app.use("/api/quizzes", quiz_1.default);
app.use("/api/quizzes/:quizId/questions", question_1.default);
app.use("/api/quizzes/:quizId/play", player_1.default);
app.get("/", (req, res) => {
    res.redirect("https://github.com/NhatPhucNguyen/QQuizzes_Backend_Express");
});
//response errors other routes
app.get("*", (req, res) => {
    res.status(404).json({ message: "URL not found." });
});
//Run server
app.listen(PORT, () => {
    console.log("Sever is listening on port:", PORT);
});
