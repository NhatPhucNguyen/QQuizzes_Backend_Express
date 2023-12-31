"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({
            message: "Unauthenticated.",
        });
    }
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        const stringDecoded = decoded;
        if (err || !stringDecoded.userId) {
            console.log(err);
            return res.status(403).json({
                message: "No permission.",
            });
        }
        req.userId = stringDecoded.userId;
        next();
    });
};
exports.default = verifyJWT;
