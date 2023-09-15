import mongoose, { Types } from "mongoose";
import PostSchema from "@Schemas/Post.schema";

type PostType = {
  _id: Types.ObjectId,
  title: string,
  image: string,
  content: string,
  description: string,
  keywords: string,
  link: string,
  modifiedAt: Date,
  postedAt: Date,
  readTime: number,
  active: boolean,
  author: Types.ObjectId,
  topics: Types.ObjectId[]
}

export let PostModel = () => {
  try {
    return mongoose.model<PostType>("post");
  } catch (error) {
    return mongoose.model<PostType>("post", PostSchema);
  }
};

export const Post = PostModel();