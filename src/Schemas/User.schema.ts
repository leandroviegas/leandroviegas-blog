import { Schema } from "mongoose";

export let UserSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String },
    profilePicture: { type: String },
    password: { type: String },
    role: { type: String },
    active: { type: Boolean }
});