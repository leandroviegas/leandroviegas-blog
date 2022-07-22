import { Request, Response } from "express";
import { hash } from "bcryptjs";
import UserEntity from "../Entity/User";
import { User } from "../Model/UserModel";
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
    const { username, password, email, link, profilePicture } = request.body;

    // Connect to the database
    await DbConnect();

    const user = new UserEntity({
      username,
      password,
      email,
      link,
      profilePicture,
      admin: false
    });

    // Validating the informations
    await user.validate()

    user.password = await hash(password, 8);

    // Creating the schema
    const postUser = new User(user);

    // Saving the informations
    await postUser.save();

    let userJson = postUser.toJSON()

    delete userJson.password;

    // Return the data
    return response.send({ user: userJson });
  }

  async update(request: Request, response: Response) {
    const { _id, username, password, email, link, profilePicture } = request.body;

    // Connect to the database
    await DbConnect();

    const user = new UserEntity({
      _id,
      username,
      password,
      email,
      link,
      profilePicture
    });

    // Validating the informations
    await user.validate()

    user.password = await hash(password, 8);

    // Creating the schema
    const postUser = new User(user);

    // Saving the informations
    await postUser.save();

    let userJson = postUser.toJSON()

    delete userJson.password;

    // Return the data
    return response.send({ user: userJson });
  }

  async delete(request: Request, response: Response) {
    const { _id } = request.query;

    // Connect to the database
    await DbConnect();

    // If is _id string
    if (typeof _id !== 'string')
      throw new Error("user/field/id/invalid-id")

    // tje function "ConvertId" also verify if the id is valid
    const user = await User.findById(_id).exec()

    // Verifiy if found the user
    if (!user)
      throw new Error("user/not-found")

    // Removing the user
    await user.remove()

    return response.send({ user: user.toJSON() });
  }
}

export { UserController };