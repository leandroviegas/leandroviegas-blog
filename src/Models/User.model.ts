import mongoose from "mongoose";
import UserEntity from "@Entity/User.entity";
import { UserSchema } from "@Schemas/User.schema";

export let UserModel = () => {
  try {
    return mongoose.model<UserEntity>("users");
  } catch (error) {
    return mongoose.model<UserEntity>("users", UserSchema);
  }
};

export const User = UserModel();