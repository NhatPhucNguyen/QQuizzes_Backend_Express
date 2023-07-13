import { Request, Response } from "express";
import { IUser } from "../interfaces/db_interfaces";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const handleRegister = async (req: Request, res: Response) => {
    const newUser = req.body as IUser;
    //checking required fields
    if (!newUser.username || !newUser.password || !newUser.email) {
        return res.status(400).json({
            message: "Missing required fields.",
        });
    }
    try {
        //make sure user does not exist
        const duplicatedUser = await User.findOne({
            username: newUser.username,
            email: newUser.email,
        });
        if (duplicatedUser) {
            return res.status(409).json({
                message: "User already existed.",
            });
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
            process.env.ACCESS_TOKEN_SECRET || "",
            { expiresIn: process.env.DEV_EXPIRE || "15m" }
        );
        //generate refresh token to save in database
        const refreshToken = jwt.sign(
            {
                userId: foundUser._id,
            },
            process.env.REFRESH_TOKEN_SECRET || "",
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
