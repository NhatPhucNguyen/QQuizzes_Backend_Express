import "express";
import { IQuiz } from "./interfaces/db_interfaces";

declare global {
    namespace Express {
        interface Locals {
            isOwner: boolean;
            foundQuiz:IQuiz;
        }
    }
}
