"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const verifyUser = async (req, res, next) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(403).json({ message: "No permission." });
    }
    try {
        const foundUser = await user_1.default.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: "User does not exist." });
        }
        req.displayName = foundUser.fullName;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.verifyUser = verifyUser;
