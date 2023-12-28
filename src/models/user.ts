import mongoose from "mongoose";
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
    },
    {
        collection: "users",
        timestamps: true,
    }
);
export default mongoose.model("User", userSchema);
