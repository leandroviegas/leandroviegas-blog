import { Request, Response } from "express";
import { User } from "@Models/User.model";

import ImageProcessing from "@utils/ImageProcessing";

class UserController {
  async list(request: Request, response: Response) {
    const { } = request.query;

    const users = await User.find({}).select("-password").exec()

    return response.send({ users })
  }

  async get(request: Request, response: Response) {
    const { _id } = request.query;

    if (typeof _id === "string") {
      const user = await User.findById(_id).select("-password").exec()

      if (user) {
        return response.send({ user: user.toJSON() });
      }
      else
        throw new Error("users/not-found")
    }

    throw new Error("users/invalid-informations")
  }

  async post(request: Request, response: Response) {
    const { username, email, password, profilePicture, about, link, github, linkedin, ocupation, active } = request.body;

    const user = await new User({ username, email, password, profilePicture, about, link, github, linkedin, ocupation, active, role: "user" }).save();

    return response.send({ user: user.toJSON() });
  }

  async update(request: Request, response: Response) {
    let { _id, username, email, password, profilePicture, profilePictureFile, about, link, github, linkedin, ocupation, active } = Object.assign(
      {
        profilePictureFile: request.file,
        ...request.body
      }
    );

    if (!["admin"].includes(request.user_role) && _id !== request.user_id) throw Error("access-denied")

    const user = await User.findOne({ _id: _id }).exec()

    if (!user) throw new Error("user/not-found")

    if (profilePictureFile != null && typeof profilePictureFile != 'string')
      profilePicture = await ImageProcessing({ image: profilePictureFile, height: 200, width: 200 });

    await user.set({ username, email, password: password ?? user.password, profilePicture, about, link, github, linkedin, ocupation, active }).save()

    return response.send({ user: user.toJSON() });

  }

  async deactive(request: Request, response: Response) {
    const { _id } = request.query;

    if (!["admin"].includes(request.user_role) && _id !== request.user_id) throw Error("access-denied")

    const user = await User.findById(_id).exec()

    if (!user)
      throw new Error("user/not-found")

    await user.set({ active: false }).save()

    return response.send({ user: user.toJSON() });
  }

  async active(request: Request, response: Response) {
    const { _id } = request.query;

    if (!["admin"].includes(request.user_role) && _id !== request.user_id) throw Error("access-denied")


    const user = await User.findById(_id).exec()

    if (!user)
      throw new Error("user/not-found")

    await user.set({ active: true }).save()

    return response.send({ user: user.toJSON() });
  }
}

export { UserController };