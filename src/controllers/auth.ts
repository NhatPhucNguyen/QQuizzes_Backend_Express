import { Request, Response } from "express";
import { IUser } from "../interfaces/db_interfaces";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

export const handleRegister = async (req: Request, res: Response) => {
    const newUser = req.body as IUser;
    //checking required fields
    if (!newUser.username || !newUser.password || !newUser.email) {
        return res.status(400).json({
            message: "Missing required fields.",
        });
    }
    try {
        //make sure user and email does not exist
        const duplicatedUser = await User.findOne({
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
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        const userToAdd = new User({ ...newUser, password: hashedPassword });
        await userToAdd.save();
        return res.status(200).json({
            message: "User was created successfully.",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong.",
        });
    }
};
export const handleLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body as {
        username: string;
        password: string;
    };
    if (!username || !password) {
        return res.status(400).json({
            message: "Missing required fields.",
        });
    }
    const foundUser = await User.findOne({ username: username });
    if (!foundUser) {
        return res.status(404).json({
            message: "User does not exist.",
        });
    }
    //compare input password vs hashed password in database
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
        return res.status(404).json({
            message: "Password is incorrect.",
        });
    } else {
        //generate access token
        const accessToken = jwt.sign(
            {
                userId: foundUser._id,
            },
            process.env.ACCESS_TOKEN_SECRET as Secret,
            { expiresIn: process.env.DEV_EXPIRE || "15m" }
        );
        //generate refresh token to save in database
        const refreshToken = jwt.sign(
            {
                userId: foundUser._id,
            },
            process.env.REFRESH_TOKEN_SECRET as Secret,
            { expiresIn: "1d" }
        );
        try {
            await User.findByIdAndUpdate(foundUser._id, {
                refreshToken: refreshToken,
            });
            //setup cookies
            res.cookie("jwt", refreshToken, {
                httpOnly: true, //http only to prevent access by using JS
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "none",
                secure: true,
            });
            return res.status(200).json({
                accessToken,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Something went wrong.",
            });
        }
    }
};
export const handleRefreshToken = async (req: Request, res: Response) => {
    const cookies: { jwt: string } = req.cookies;
    //checking cookies exist
    if (!cookies.jwt) {
        return res.status(401).json({
            message: "Unauthenticated.",
        });
    }
    const refreshToken = cookies.jwt;
    try {
        const foundUser = await User.findOne({ refreshToken: refreshToken });
        if (!foundUser) {
            return res.status(403).json({
                message: "No permission to refresh token.",
            });
        }
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as Secret,
            (err, decoded) => {
                //decoding the token
                const { userId } = decoded as { userId: string };
                //check if userId matches or errors happen
                if (err || userId !== foundUser._id.toString()) {
                    return res.status(403).json({
                        message: "No permission to refresh token.",
                    });
                }
                //re-generate a token
                const accessToken = jwt.sign(
                    {
                        userId: userId,
                    },
                    process.env.ACCESS_TOKEN_SECRET as Secret,
                    { expiresIn: process.env.DEV_EXPIRE || "15m" }
                );
                return res.status(200).json({
                    accessToken,
                });
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong.",
        });
    }
};
export const handleLogout = async (req: Request, res: Response) => {
    const cookies: { jwt: string } = req.cookies;
    //checking cookies exist
    if (!cookies.jwt) {
        return res.status(401).json({
            message: "Unauthenticated.",
        });
    }
    const refreshToken = cookies.jwt;
    try {
        const foundUser = await User.findOne({ refreshToken: refreshToken });
        if (!foundUser) {
            res.clearCookie("jwt", { httpOnly: true }); //clear cookies when user not exist in database
            return res.status(403).json({
                message: "No permission.",
            });
        }
        await User.findByIdAndUpdate(foundUser._id, { refreshToken: "" });
        res.clearCookie("jwt", { httpOnly: true });
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong.",
        });
    }
};
