import mongoose, { Schema } from "mongoose";
import { IPlayer } from "../interfaces/db_interfaces";

const playerSchema = new Schema<IPlayer>(
    {
        userId: {
            type: "string",
            required: true,
        },
        quizParticipated: {
            type:"string",
            require:true
        },
        attempts: {
            type: [Object],
        },
    },
    { collection: "players" }
);

export default mongoose.model("Player", playerSchema);
