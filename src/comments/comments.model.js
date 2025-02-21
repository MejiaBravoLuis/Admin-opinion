import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
    {
        comment: {
            type: String,
            required: [true, "Comment is required"],
            maxLength: [200, "Can't exceed 200 characters"],
            minLength: [5, "5 characters min"],
            trim: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },
        status: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model ("Comment", CommentSchema)