import { NextFunction, Request, Response } from "express";
import User from "../models/user"
export const verifyUser = async (req:Request,res:Response,next:NextFunction) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(403).json({ message: "No permission." });
    }
    try {
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: "User does not exist." });
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
}