import jwt, { Secret } from "jsonwebtoken";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({
            message: "Unauthenticated.",
        });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as Secret,
        (err, decoded) => {
            const stringDecoded = decoded as { userId: string };
            if (err || !stringDecoded.userId) {
                console.log(err);
                return res.status(403).json({
                    message: "No permission.",
                });
            }
            req.userId = stringDecoded.userId;
            next();
        }
    );
};
export default verifyJWT;
