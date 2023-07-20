export interface IUser {
    username: string;
    password: string;
    email: string;
    purpose: string;
    fullName: string;
    educationInstitution?: string;
    job?: string;
    role: string;
    refreshToken?: string;
}

export interface ICollection {
    collectionName: string;
    topic: string;
    level: string;
    quantity?: number;
    userId: string;
}

declare module "express" {
    export interface Request {
        userId?: string;
    }
}
