"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const quizController = __importStar(require("../controllers/quiz"));
const verifyUser_1 = require("../middleware/verifyUser");
const quizRouter = express_1.default.Router({ mergeParams: true });
quizRouter.use(verifyJWT_1.default);
quizRouter.use(verifyUser_1.verifyUser);
quizRouter.post("/", quizController.quizCreate);
quizRouter.get("/admin", quizController.getOwnedQuizzes);
quizRouter.get("/public", quizController.getPublicQuizzes);
quizRouter.get("/:quizId", quizController.getSingleQuiz);
quizRouter.put("/:quizId", quizController.updateQuiz);
quizRouter.delete("/:quizId", quizController.deleteQuiz);
exports.default = quizRouter;
