import { Request, Response } from "express";
import User from "../models/user";
import Collection from "../models/collection";
import { ICollection } from "../interfaces/db_interfaces";

export const collectionCreate = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const newCollection = req.body as ICollection;
        if (!newCollection.collectionName || !newCollection.topic) {
            return res.status(400).json({
                message: "Missing required fields.",
            });
        }
        const duplicatedCollection = await Collection.findOne({
            $and: [
                { userId: userId },
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
            userId: userId,
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

export const getSingleCollection = async (req: Request, res: Response) => {
    const collectionName = req.params.name;
    try {
        const foundCollection = await Collection.findOne({
            collectionName: collectionName,
        });
        if (!foundCollection) {
            return res.status(404).json({ message: "Collection not found." });
        }
        return res.status(200).json(foundCollection);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const getOwnedCollections = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const foundCollections = await Collection.find({ userId });
        return res.status(200).json(foundCollections);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const updateCollection = async (req: Request, res: Response) => {
    const userId = req.userId;
    const collectionName = req.params.name;
    try {
        const newCollection = req.body as ICollection;
        if (!newCollection.collectionName || !newCollection.topic) {
            return res.status(400).json({
                message: "Missing required fields.",
            });
        }
        await Collection.findOneAndUpdate(
            {
                $and: [{ userId: userId }, { collectionName: collectionName }],
            },
            {...newCollection}
        );
        return res.status(200).json("Collection is successfully update.");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
