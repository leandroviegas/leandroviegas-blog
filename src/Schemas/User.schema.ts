import { Schema } from "mongoose";

export let UserSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    about: { type: String },
    link: { type: String, unique: true },
    profilePicture: { type: String },
    password: { type: String },
    role: { type: String },
    active: { type: Boolean }
});