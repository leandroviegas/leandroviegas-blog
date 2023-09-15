import mongoose, { Types } from "mongoose";
import UserSchema from "@Schemas/User.schema";

type UserType = {
  _id: Types.ObjectId,
  username: string,
  email: string,
  password: string,
  profilePicture: string,
  about: string,
  link: string,
  github: string,
  linkedin: string,
  ocupation: string,
  active: boolean,
  role: string,
}

export let UserModel = () => {
  try {
    return mongoose.model<UserType>("users");
  } catch (error) {
    return mongoose.model<UserType>("users", UserSchema);
  }
};

export const User = UserModel();