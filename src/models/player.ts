import mongoose, { Schema, SchemaType } from "mongoose";
import { IPlayer, IResult } from "../interfaces/db_interfaces";

const playerSchema = new Schema<IPlayer>(
    {
        userId: {
            type: "string",
            required: true,
        },
        quizParticipated: {
            type: "string",
            require: true,
        },
        displayName: {
            type: "string",
            required: true,
        },
        result: {
            type: Schema.Types.Mixed,
        },
    },
    { collection: "players" }
);

export default mongoose.model("Player", playerSchema);
