import mongoose, { Types } from "mongoose";
import { PostSchema } from "../Schemas/PostSchema";

export type PostModelT = {
  _id?: Types.ObjectId;
  title: string;
  content: string;
  image?: string;
  link: string;
  readTime: number;
  active: boolean;
  category: Types.ObjectId;
  author: Types.ObjectId;
  keywords: string;
  description: string;
  modifiedAt: Date;
  postedAt: Date;
};

export let PostModel = () => {
  try {
    return mongoose.model<PostModelT>("post");
  } catch (error) {
    return mongoose.model<PostModelT>("post", PostSchema);
  }
};

export const Post = PostModel();