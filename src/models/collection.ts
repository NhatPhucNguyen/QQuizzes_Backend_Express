import mongoose from "mongoose";
import { ICollection } from "../interfaces/db_interfaces";
import bcrypt from "bcrypt";

const collectionSchema = new mongoose.Schema<ICollection>(
    {
        collectionName: {
            type: "string",
            required: true,
            unique: true,
        },
        topic: {
            type: "string",
        },
        level: {
            type: "string",
            default: "basic",
        },
        quantity: {
            type: "number",
        },
        userId: {
            type: "string",
            required: true,
        },
    },
    {
        collection: "collections",
    }
);
export default mongoose.model("Collection", collectionSchema);
