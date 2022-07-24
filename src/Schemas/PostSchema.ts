import { Schema } from "mongoose";

export let PostSchema = new Schema({
    title: { type: String },
    content: { type: String },
    image: { type: String },
    link: { type: String, unique: true },
    readTime: { type: Number },
    active: { type: Boolean },
    category: { type: Schema.Types.ObjectId },
    author: { type: Schema.Types.ObjectId },
    keywords: { type: String },
    description: { type: String },
    modifiedAt: { type: Date },
    postedAt: { type: Date },
});
