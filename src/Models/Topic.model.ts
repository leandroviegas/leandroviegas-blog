import mongoose from "mongoose";
import TopicEntity from "@Entity/Topic.entity";
import { TopicSchema } from "@Schemas/Topic.schema";

export let TopicModel = () => {
  try {
    return mongoose.model<TopicEntity>("topic");
  } catch (error) {
    return mongoose.model<TopicEntity>("topic", TopicSchema);
  }
};

export const Topic = TopicModel();