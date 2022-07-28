import mongoose from "mongoose";
import CategoryEntity from "../Entity/Category.entity";
import { CategorySchema } from "../Schemas/Category.schema";

export let CategoryModel = () => {
  try {
    return mongoose.model<CategoryEntity>("category");
  } catch (error) {
    return mongoose.model<CategoryEntity>("category", CategorySchema);
  }
};

export const Category = CategoryModel();