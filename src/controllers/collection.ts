import { Request, Response } from "express";
import User from "../models/user";
import Collection from "../models/collection";
import { ICollection } from "../interfaces/db_interfaces";

export const handleCollectionCreate = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(403).json({ message: "No permission." });
    }
    try {
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: "User does not exist." });
        }
        const newCollection = req.body as ICollection;
        if (!newCollection.collectionName || !newCollection.topic) {
            return res.status(400).json({
                message: "Missing required fields.",
            });
        }
        const duplicatedCollection = await Collection.findOne({
            $and: [
                { userId: foundUser._id },
                { collectionName: newCollection.collectionName },
            ],
        });
        if (duplicatedCollection) {
            return res
                .status(409)
                .json({ message: "Collection already existed." });
        }
        const collectionToAdd = new Collection({
            ...newCollection,
            userId: foundUser._id,
        });
        await collectionToAdd.save();
        return res.status(200).json({
            message: "Collection created successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong.",
        });
    }
};
