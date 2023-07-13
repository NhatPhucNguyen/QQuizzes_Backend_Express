import mongoose, { Collection } from "mongoose";
import { IUser } from "../interfaces/db_interfaces";

const userSchema = new mongoose.Schema<IUser>(
    {
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
        job: {
            type: "String",
            required: true,
        },
        educationInstitution: {
            type: "String",
        },
        role: {
            type: "String",
            required: true,
            default: "user",
        },
    },
    {
        collection: "users",
    }
);
export default mongoose.model("User", userSchema);
