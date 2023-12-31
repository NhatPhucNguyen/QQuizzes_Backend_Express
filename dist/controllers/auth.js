"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogout = exports.handleRefreshToken = exports.handleLogin = exports.handleRegister = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const handleRegister = async (req, res) => {
    const newUser = req.body;
    //checking required fields
    if (!newUser.username || !newUser.password || !newUser.email) {
        return res.status(400).json({
            message: "Missing required fields.",
        });
    }
    try {
        //make sure user and email does not exist
        const duplicatedUser = await user_1.default.findOne({
            $or: [{ username: newUser.username }, { email: newUser.email }],
        });
        if (duplicatedUser) {
            if (duplicatedUser.username === newUser.username) {
                return res.status(409).json({
                    message: "User already existed.",
                });
            }
            if (duplicatedUser.email === newUser.email) {
                return res.status(409).json({
                    message: "Email was already in use.",
                });
            }
        }
        const hashedPassword = await bcrypt_1.default.hash(newUser.password, 10);
        const userToAdd = new user_1.default({ ...newUser, password: hashedPassword });
        await userToAdd.save();
        return res.status(200).json({
            message: "User was created successfully.",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong.",
        });
    }
};
exports.handleRegister = handleRegister;
const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            message: "Missing required fields.",
        });
    }
    const foundUser = await user_1.default.findOne({ username: username });
    if (!foundUser) {
        return res.status(404).json({
            message: "User does not exist.",
        });
    }
    //compare input password vs hashed password in database
    const isMatch = await bcrypt_1.default.compare(password, foundUser.password);
    if (!isMatch) {
        return res.status(404).json({
            message: "Password is incorrect.",
        });
    }
    else {
        //generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            userId: foundUser._id,
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.DEV_EXPIRE || "15m" });
        //generate refresh token to save in database
        const refreshToken = jsonwebtoken_1.default.sign({
            userId: foundUser._id,
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
        try {
            await user_1.default.findByIdAndUpdate(foundUser._id, {
                refreshToken: refreshToken,
            });
            //setup cookies
            res.cookie("jwt", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "none",
                secure: true,
            });
            return res.status(200).json({
                accessToken,
                fullName: foundUser.fullName,
                userId: foundUser._id
            });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Something went wrong.",
            });
        }
    }
};
exports.handleLogin = handleLogin;
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    //checking cookies exist
    if (!cookies.jwt) {
        return res.status(401).json({
            message: "Unauthenticated.",
        });
    }
    const refreshToken = cookies.jwt;
    try {
        const foundUser = await user_1.default.findOne({ refreshToken: refreshToken });
        if (!foundUser) {
            return res.status(422).json({
                message: "Invalid refresh token",
            });
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            //decoding the token
            const { userId } = decoded;
            //check if userId matches or errors happen
            if (err || userId !== foundUser._id.toString()) {
                return res.status(403).json({
                    message: "No permission to refresh token.",
                });
            }
            //re-generate a token
            const accessToken = jsonwebtoken_1.default.sign({
                userId: userId,
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.DEV_EXPIRE || "15m" });
            return res.status(200).json({
                accessToken,
            });
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong.",
        });
    }
};
exports.handleRefreshToken = handleRefreshToken;
const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    //checking cookies exist
    if (!cookies.jwt) {
        return res.status(401).json({
            message: "Unauthenticated.",
        });
    }
    const refreshToken = cookies.jwt;
    try {
        const foundUser = await user_1.default.findOne({ refreshToken: refreshToken });
        if (!foundUser) {
            res.clearCookie("jwt", {
                httpOnly: true,
            }); //clear cookies when user not exist in database
            return res.status(403).json({
                message: "No permission.",
            });
        }
        await user_1.default.findByIdAndUpdate(foundUser._id, { refreshToken: "" });
        res.clearCookie("jwt", {
            httpOnly: true,
        });
        return res.sendStatus(204);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong.",
        });
    }
};
exports.handleLogout = handleLogout;
