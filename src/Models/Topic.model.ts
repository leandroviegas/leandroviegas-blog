import mongoose, { Types } from "mongoose";
import TopicSchema from "@Schemas/Topic.schema";

type PostType = {
  _id: Types.ObjectId,
  name: string,
  link: string,
  description: string,
  image: string
}

export let TopicModel = () => {
  try {
    return mongoose.model<PostType>("topic");
  } catch (error) {
    return mongoose.model<PostType>("topic", TopicSchema);
  }
};

export const Topic = TopicModel();