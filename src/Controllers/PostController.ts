import { Request, Response } from "express";
import PostEntity from "../Entity/Post";
import { Post } from "../Model/PostModel";
import DbConnect from "./../utils/dbConnect";

class PostController {
  async list(request: Request, response: Response) {
    const { } = request.query;

    // Connect to the database
    await DbConnect();

    // Get the posts
    const posts = await Post.find({}).select("").exec()

    return response.send({ posts })
  }

  async get(request: Request, response: Response) {
    const { _id, link } = request.query;

    // Connect to the database
    await DbConnect();

    const post = await Post.findOne({ $or: [{ _id }, { link }] }).select("").exec()

    // Verifiy if found the post
    if (post) {
      return response.send({ post: post.toJSON() });
    }
    else
      throw new Error("posts/not-found")
  }

  async post(request: Request, response: Response) {
    const { title, content, image, link, readTime, active, category, author, keywords, description, modifiedAt, postedAt } = request.body;

    // Connect to the database
    await DbConnect();

    const post = new PostEntity({
      title,
      content,
      image,
      link,
      readTime,
      active,
      category,
      author: request.user_id,
      keywords,
      description,
      modifiedAt,
      postedAt
    });

    // Validating the informations
    await post.validate()

    // Creating the schema
    const PostS = new Post(post);

    // Saving the informations
    await PostS.save();

    let postJSON = PostS.toJSON();

    // Return the data
    return response.send({ post: postJSON });
  }

  async update(request: Request, response: Response) {
    const { _id, title, content, image, link, readTime, active, category, author, keywords, description, modifiedAt, postedAt } = request.body;

    // Connect to the database
    await DbConnect();

    const postEntity = new PostEntity({
      _id,
      title,
      content,
      image,
      link,
      readTime,
      active,
      category,
      author: request.user_id,
      keywords,
      description,
      modifiedAt,
      postedAt
    });

    await postEntity.validate()

    // Creating the schema
    const post = await Post.findOne({ _id: postEntity._id, author: postEntity.author }).exec()

    // Saving the informations
    post.set(postEntity)

    // Saving the informations
    await post.save();

    let postJSON = post.toJSON();

    // Return the data
    return response.send({ post: postJSON });
  }

  async delete(request: Request, response: Response) {
    const { _id } = request.query;

    // Connect to the database
    await DbConnect();

    // If is _id string
    if (typeof _id !== 'string')
      throw new Error("post/id/invalid")

    // tje function "ConvertId" also verify if the id is valid
    const post = await Post.findById(_id).exec()

    // Verifiy if found the post
    if (!post)
      throw new Error("post/not-found")

    // Removing the post
    await post.remove()

    return response.send({ post: post.toJSON() });
  }
}

export { PostController };