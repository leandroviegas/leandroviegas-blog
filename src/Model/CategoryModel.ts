import mongoose, { Types } from "mongoose";
import { CategorySchema } from "../Schemas/CategorySchema";

export type CategoryModelT = {
  _id?: Types.ObjectId;
  name: string;
  link: string;
  description: string;
  image: string;
};

export let CategoryModel = () => {
  try {
    return mongoose.model<CategoryModelT>("category");
  } catch (error) {
    return mongoose.model<CategoryModelT>("category", CategorySchema);
  }
};

export const Category = CategoryModel();