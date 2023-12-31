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
const questionControllers = __importStar(require("../controllers/question"));
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const verifyQuiz_1 = require("../middleware/verifyQuiz");
const questionRouter = express_1.default.Router({ mergeParams: true });
questionRouter.use(verifyJWT_1.default);
questionRouter.use(verifyQuiz_1.verifyQuiz);
//create a question
questionRouter.post("/", questionControllers.createQuestion);
//get all questions from a quiz
questionRouter.get("/", questionControllers.getAllQuestions);
//get all questions from a quiz belong to user
questionRouter.get("/private", (req, res, next) => {
    if (!res.locals.isOwner) {
        return res.status(401).json({
            message: "No permission to access this quiz",
        });
    }
    next();
}, questionControllers.getAllQuestions);
questionRouter.delete("/:questionId", questionControllers.deleteQuestion);
questionRouter.put("/:questionId", questionControllers.updateQuestion);
exports.default = questionRouter;
