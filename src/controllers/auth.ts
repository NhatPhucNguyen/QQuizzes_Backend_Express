import { Request, Response } from "express";
import { IUser } from "../interfaces/db_interfaces";
import User from "../models/user";
import bcrypt from "bcrypt";
export const handleRegister = async (req: Request, res: Response) => {
    const newUser = req.body as IUser;
    if (!newUser.username || !newUser.password || !newUser.email) {
        return res.status(400).json({
            message: "Missing required fields.",
        });
    }
    try {
        const duplicatedUser = await User.findOne({
            username: newUser.username,
            email: newUser.email,
        });
        if (duplicatedUser) {
            return res.status(409).json({
                message: "User already existed.",
            });
        }
        const hashedPassword = bcrypt.hash(newUser.password, 10);
        const userToAdd = new User(newUser);
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
