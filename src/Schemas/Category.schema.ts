import { Schema } from "mongoose";

export let CategorySchema = new Schema({
    name: { type: String },
    link: { type: String, unique: true },
    description: { type: String },
    image: { type: String }
});