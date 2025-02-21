import { Schema, model } from "mongoose";

const PublicationSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            maxLength: [50, "Can't exceed 50 characters"],
            minLength: [5, "5 characters min"],
            trim: true
        },
        ppalText: {
            type: String,
            required: [true, "Add a text to your publication"],
            maxLength: [1000, "Can't exceed 1000 characters"],
            minLength: [10, "10 characters min"],
            trim: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Add a category"]
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        status: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
        versionKey: false
    },
);

export default model ("Publication", PublicationSchema)