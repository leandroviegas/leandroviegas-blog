import { Schema } from "mongoose";

export let UserSchema = new Schema({
    username: { type: String },
    email: { type: String, unique: true },
    about: { type: String },
    linkedin: { type: String },
    github: { type: String },
    ocupation: { type: String },
    link: { type: String, unique: true },
    profilePicture: { type: String },
    password: { type: String },
    role: { type: String },
    active: { type: Boolean }
});