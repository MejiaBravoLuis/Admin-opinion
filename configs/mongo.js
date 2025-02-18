'use strict';

import mongoose from "mongoose";
import Usuario from "../src/users/user.model.js";
import { hash } from "argon2";

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('Could not connect to MongoDB');
            mongoose.disconnect();
        });

        mongoose.connection.on('connecting', () => {
            console.log('Trying to connect...');
        });

        mongoose.connection.on('connected', async () => {
            console.log('Connected to MongoDB');

            try {
                const adminExists = await Usuario.findOne({ role: "ADMIN" });
                if (!adminExists) {
                    const admin = await hash("12345678"); 
                    await Usuario.create({
                        name: "Admin",
                        surname: "User",
                        username: "admin",
                        email: "admin@gmail.com",
                        password: admin,
                        role: "ADMIN"
                    });
                    console.log("|||| Admin user created default ||||");
                } else {
                    console.log("---- Admin user already exists ----");
                }
            } catch (error) {
                console.error(" Something went wrong trying to create the admin user:", error);
            }
        });

        mongoose.connection.on('open', () => {
            console.log('Database connection open');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('Reconnected to MongoDB');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Disconnected from MongoDB');
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });

    } catch (error) {
        console.log('Database connection failed:', error);
    }
};