import mongoose, { Types } from "mongoose";
import CommentSchema from "@Schemas/Comment.schema";

type CommentType = {
  _id: Types.ObjectId,
  user: Types.ObjectId;
  post: Types.ObjectId;
  referenceComment: Types.ObjectId;
  content: string;
  modifiedAt: Date;
  postedAt: Date;
}

export let CommentModel = () => {
  try {
    return mongoose.model<CommentType>("comments");
  } catch (error) {
    return mongoose.model<CommentType>("comments", CommentSchema);
  }
};

export const Comment = CommentModel();
