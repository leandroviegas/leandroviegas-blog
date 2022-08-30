import { Schema } from "mongoose";

export let TopicSchema = new Schema({
    name: { type: String },
    link: { type: String, unique: true },
    description: { type: String },
    image: { type: String }
});