import mongoose, { Types } from "mongoose";
import { UserSchema } from "../Schemas/UserSchema";

export type UserModelT = {
  _id?: Types.ObjectId;
  username: string;
  email: string;
  profilePicture?: string;
  password: string;
  link: string;
  admin?: boolean;
  active: boolean;
};

export let UserModel = () => {
  try {
    return mongoose.model<UserModelT>("users");
  } catch (error) {
    return mongoose.model<UserModelT>("users", UserSchema);
  }
};

export const User = UserModel();