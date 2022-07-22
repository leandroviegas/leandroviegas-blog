import mongoose from "mongoose";
import { UserModelT } from "../Entity/User";
import { UserSchema } from "../Schemas/UserSchema";

export let UserModel = () => {
  try {
    return mongoose.model<UserModelT>("users");
  } catch (error) {
    return mongoose.model<UserModelT>("users", UserSchema);
  }
};

export const User = UserModel();