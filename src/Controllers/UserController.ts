import { Request, Response } from "express";
import { hash } from "bcryptjs";
import UserEntity from "@Entity/User.entity";
import { User } from "@Models/User.model";
import ConnectDB from "@utils/ConnectDB";

import uploadImageToImageBB from "@utils/ImageUploadBB";

class UserController {
  async list(request: Request, response: Response) {
    const { } = request.query;

    await ConnectDB();

    const users = await User.find({}).select("-password").exec()

    return response.send({ users })
  }

  async get(request: Request, response: Response) {
    const { _id } = request.query;

    await ConnectDB();

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
    const { _id, username, email, password, profilePicture, about, link, github, linkedin, ocupation, active, role } = Object.assign(
      { // default values
        about: "",
        github: "",
        linkedin: "",
        ocupation: "",
        profilePicture: ""
      },
      request.body, // form values
      { // mandatory values
        _id: undefined,
        active: true,
        role: "user"
      }
    );

    await ConnectDB();

    const userEntity = new UserEntity(_id, username, email, password, profilePicture, about, link, github, linkedin, ocupation, active, role);

    await userEntity.validate()

    userEntity.password = await hash(password, 8);

    const user = new User(userEntity);

    await user.save();

    let userJSON = user.toJSON()

    delete userJSON.password;

    return response.send({ user: userJSON });
  }

  async update(request: Request, response: Response) {
    let { _id, username, email, password, profilePicture, profilePictureFile, about, link, github, linkedin, ocupation, active, role } = Object.assign(
      { // default values
        _id: undefined,
        about: "",
        username: "",
        email: "",
        password: "",
        link: "",
        github: "",
        linkedin: "",
        ocupation: "",
        profilePicture: "",
        profilePictureFile: request.file,
        ...request.body
      }
    );

    if (!["admin"].includes(request.user_role) && _id !== request.user_id) throw Error("access-denied")

    await ConnectDB();

    const user = await User.findOne({ _id: _id }).exec()

    if (!user) throw new Error("user/not-found")

    if (profilePictureFile != null && typeof profilePictureFile != 'string')
      profilePicture = await uploadImageToImageBB(profilePictureFile);

    const userEntity = new UserEntity(_id, username, email, password ?? user.password, profilePicture, about, link, github, linkedin, ocupation, active, user.role);

    await userEntity.validate({ ignorePassword: true })

    if (password)
      userEntity.password = await hash(password, 8);

    user.set(userEntity)

    await user.save()

    let userJSON = user.toJSON()

    delete userJSON.password;

    return response.send({ user: userJSON });

  }

  async deactive(request: Request, response: Response) {
    const { _id } = request.query;

    if (!["admin"].includes(request.user_role) && _id !== request.user_id) throw Error("access-denied")

    await ConnectDB();

    if (typeof _id !== 'string')
      throw new Error("user/id/invalid-id")

    const user = await User.findById(_id).exec()

    if (!user)
      throw new Error("user/not-found")

    user.set({ active: false })

    await user.save()

    return response.send({ user: user.toJSON() });
  }

  async active(request: Request, response: Response) {
    const { _id } = request.query;

    if (!["admin"].includes(request.user_role) && _id !== request.user_id) throw Error("access-denied")

    await ConnectDB();

    if (typeof _id !== 'string')
      throw new Error("user/id/invalid-id")

    const user = await User.findById(_id).exec()

    if (!user)
      throw new Error("user/not-found")

    user.set({ active: true })

    await user.save()

    return response.send({ user: user.toJSON() });
  }
}

export { UserController };