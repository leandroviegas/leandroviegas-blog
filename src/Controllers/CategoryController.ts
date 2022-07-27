import { Request, Response } from "express";
import CategoryEntity from "../Entity/Category";
import { Category } from "../Model/CategoryModel";
import DbConnect from "./../utils/dbConnect";

class CategoryController {
  async list(request: Request, response: Response) {
    const { } = request.query;

    // Connect to the database
    await DbConnect();

    // Get the categories
    const categories = await Category.find({}).select("-password").exec()

    return response.send({ categories })
  }

  async get(request: Request, response: Response) {
    const { _id, link } = request.query;

    // Connect to the database
    await DbConnect();

    const post = await Category.findOne({ $or: [{ _id }, { link }] }).select("").exec()

    // Verifiy if found the post
    if (post) {
      return response.send({ post: post.toJSON() });
    }
    else
      throw new Error("posts/not-found")
  }

  async post(request: Request, response: Response) {
    const { name, link, description, image } = request.body;

    // Connect to the database
    await DbConnect();

    const category = new CategoryEntity({ name, link, description, image });

    // Validating the informations
    await category.validate()

    // Creating the schema
    const CategoryS = new Category(category);

    // Saving the informations
    await CategoryS.save();

    let categoryJSON = CategoryS.toJSON()

    // Return the data
    return response.send({ category: categoryJSON });
  }

  async update(request: Request, response: Response) {
    const { _id, name, link, description, image } = request.body;

    // Connect to the database
    await DbConnect();

    const categoryEntity = new CategoryEntity({ _id, name, link, description, image });

    // Validating the informations
    await categoryEntity.validate()

    // Find category
    const category = await Category.findById(_id).exec()

    // Updating the fields
    category.set(categoryEntity)

    // Saving the informations
    await category.save();

    let categoryJSON = category.toJSON()

    // Return the data
    return response.send({ category: categoryJSON });
  }

  async delete(request: Request, response: Response) {
    const { _id } = request.query;

    // Connect to the database
    await DbConnect();

    // If is _id string
    if (typeof _id !== 'string')
      throw new Error("category/id/invalid-id")

    // tje function "ConvertId" also verify if the id is valid
    const category = await Category.findById(_id).exec()

    // Verifiy if found the category
    if (!category)
      throw new Error("category/not-found")

    // Removing the category
    await category.remove()

    return response.send({ category: category.toJSON() });
  }
}

export { CategoryController };