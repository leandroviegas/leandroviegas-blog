import mongoose from "mongoose";
import PostEntity from "../Entity/Post.entity";
import { PostSchema } from "../Schemas/Post.schema";

export let PostModel = () => {
  try {
    return mongoose.model<PostEntity>("post");
  } catch (error) {
    return mongoose.model<PostEntity>("post", PostSchema);
  }
};

export const Post = PostModel();