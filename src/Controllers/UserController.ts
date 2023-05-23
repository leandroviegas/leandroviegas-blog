import { Request, Response } from "express";
import { hash } from "bcryptjs";
import UserEntity from "../Entity/User.entity";
import { User } from "../Model/User.model";
import DbConnect from "./../utils/dbConnect";

class UserController {
  async list(request: Request, response: Response) {
    const { } = request.query;

    // Connect to the database
    await DbConnect();

    // Get the users
    const users = await User.find({}).select("-password").exec()

    return response.send({ users })
  }

  async get(request: Request, response: Response) {
    const { _id } = request.query;

    // Connect to the database
    await DbConnect();

    // Verify if the data is valid
    if (typeof _id === "string") {
      const user = await User.findById(_id).select("-password").exec()

      // Verifiy if found the user
      if (user) {
        return response.send({ user: user.toJSON() });
      }
      else
        throw new Error("users/not-found")
    }

    throw new Error("users/invalid-informations")
  }

  async post(request: Request, response: Response) {
    const { username, password, email, link, profilePicture, about } = request.body;

    // Connect to the database
    await DbConnect();

    const userEntity = new UserEntity({
      username,
      password,
      email,
      link,
      about: about || "",
      role: "user",
      profilePicture,
      active: true,
    });

    // Validating the informations
    await userEntity.validate()

    userEntity.password = await hash(password, 8);

    // Creating the schema
    const user = new User(userEntity);

    // Saving the informations
    await user.save();

    let userJSON = user.toJSON()

    delete userJSON.password;

    // Return the data
    return response.send({ user: userJSON });
  }

  async update(request: Request, response: Response) {
    const { _id, username, password, email, link, about, profilePicture } = request.body;

    // Connect to the database
    await DbConnect();

    // Creating the schema
    const user = await User.findOne({ _id: _id }).exec()

    if (!user) throw new Error("user/not-found")

    const userEntity = new UserEntity({
      _id: user._id,
      username: username ?? user.username,
      password: password ?? user.password,
      active: user.active,
      about: about ?? user.about,
      email: email ?? user.email,
      link: link ?? user.link,
      role: user.role,
      profilePicture: profilePicture ?? user.profilePicture
    });

    // Validating the informations
    await userEntity.validate()

    if (password)
      userEntity.password = await hash(password, 8);

    user.set(userEntity)

    // Saving the informations
    await user.save()

    let userJSON = user.toJSON()

    delete userJSON.password;

    // Return the data
    return response.send({ user: userJSON });
  }

  async deactive(request: Request, response: Response) {
    const { _id } = request.query;

    // Connect to the database
    await DbConnect();

    // If is _id string
    if (typeof _id !== 'string')
      throw new Error("user/id/invalid-id")

    const user = await User.findById(_id).exec()

    // Verifiy if found the user
    if (!user)
      throw new Error("user/not-found")

    // Removing the user
    user.set({ active: false })

    await user.save()

    return response.send({ user: user.toJSON() });
  }

  async active(request: Request, response: Response) {
    const { _id } = request.query;

    // Connect to the database
    await DbConnect();

    // If is _id string
    if (typeof _id !== 'string')
      throw new Error("user/id/invalid-id")

    const user = await User.findById(_id).exec()

    // Verifiy if found the user
    if (!user)
      throw new Error("user/not-found")

    // Removing the user
    user.set({ active: true })

    await user.save()

    return response.send({ user: user.toJSON() });
  }
}

export { UserController };