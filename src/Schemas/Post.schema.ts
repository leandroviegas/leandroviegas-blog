import linkfy from "@utils/linkfy";
import { Schema } from "mongoose";

let PostSchema = new Schema({
  title: { type: String, required: [true, "title/title-is-required"] },
  content: { type: String },
  image: { type: String },
  link: { type: String, required: [true, "link/link-is-required"], unique: true },
  readTime: { type: Number },
  active: { type: Boolean },
  topics: [{
    ref: 'topics',
    type: Schema.Types.ObjectId,
  }],
  author: {
    ref: 'users',
    type: Schema.Types.ObjectId,
  },
  keywords: { type: String },
  description: { type: String },
  modifiedAt: { type: Date, default: Date.now },
  postedAt: { type: Date, default: Date.now },
});

PostSchema.pre("validate", function (next) {
  this.link = linkfy(this.link);
  next();
});

export default PostSchema;