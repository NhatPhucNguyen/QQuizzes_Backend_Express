"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: "String",
        required: true,
        unique: true,
    },
    password: {
        type: "String",
        required: true,
    },
    email: {
        type: "String",
        required: true,
        unique: true,
    },
    fullName: {
        type: "String",
        required: true,
    },
    purpose: {
        type: "String",
        required: true,
        default: "Personal",
    },
    job: {
        type: "String",
    },
    educationInstitution: {
        type: "String",
    },
    role: {
        type: "String",
        required: true,
        default: "user",
    },
    refreshToken: {
        type: "String",
        expires: 60 * 60 * 24,
    },
}, {
    collection: "users",
    timestamps: true,
});
exports.default = mongoose_1.default.model("User", userSchema);
