import { describe, it } from "@jest/globals";
import "dotenv/config";
import express from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";
import {
    handleLogin,
    handleRegister
} from "../controllers/auth";
import { IUser } from "../interfaces/db_interfaces";
import User from "../models/user";
const app = express();
app.use(express.json());
app.post("/api/auth", handleRegister);
app.post("/api/auth/login", handleLogin);
beforeEach(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});
afterEach(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
});
describe("Authentication Test", () => {
    const testUser = {
        username: "test",
        password: "123456",
        email: "test@gmail.com",
        fullName: "test",
    } as IUser;
    describe("User registration", () => {
        it("Given all required fields are valid", async () => {
            const { statusCode, body } = await supertest(app)
                .post("/api/auth")
                .send(testUser);
            expect(statusCode).toBe(200);
            expect(body.message).toEqual("User was created successfully.");
        });
        it("Username already existed", async () => {
            const newUser = new User(testUser);
            await newUser.save();
            const { statusCode, body } = await supertest(app)
                .post("/api/auth")
                .send(testUser);
            expect(statusCode).toBe(409);
        });
        it("Email already existed", async () => {
            const newUser = new User({ ...testUser, username: "different" });
            await newUser.save();
            const { statusCode, body } = await supertest(app)
                .post("/api/auth")
                .send(testUser);
            expect(statusCode).toBe(409);
        });
    });
    describe("User login", () => {
        it("Missing required fields", async () => {
            const emptyUser = {} as IUser;
            const { statusCode } = await supertest(app)
                .post("/api/auth/login")
                .send(emptyUser);
            expect(statusCode).toBe(400);
        });
        it("Username does not existed", async () => {
            const notFoundUser = { ...testUser, username: "notFound" };
            const { statusCode } = await supertest(app)
                .post("/api/auth/login")
                .send(notFoundUser);
            expect(statusCode).toBe(404);
        });
        it("Login successfully, access token returned", async () => {
            await supertest(app).post("/api/auth").send(testUser);
            const response = await supertest(app)
                .post("/api/auth/login")
                .send(testUser);
            expect(response.statusCode).toBe(200);
            expect(response.body.accessToken).not.toBeNull();
        });
    });
});
