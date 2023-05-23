import { Request, Response } from "express";
import { Types } from "mongoose";
import PostEntity from "../Entity/Post.entity";
import { Topic } from "../Model/Topic.model";
import { Post } from "../Model/Post.model";
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

    const post = await Post.findOne({ $or: [{ _id }, { link }] }).select("").populate('author', "-password").exec()

    // Verifiy if found the post
    if (post) {
      return response.send({ post: post.toJSON() });
    }
    else
      throw new Error("posts/not-found")
  }

  async byTopic(request: Request, response: Response) {
    let { perPage, topic_link, page } = request.query;

    let n_perPage = Math.max(0, Number(Number(perPage)))

    let n_page = Math.max(25, Number(page))

    // Connect to the database
    await DbConnect();

    const topic = await Topic.findOne({ 'link': { $in: topic_link } }).exec()

    const total = await Post.find({ topics: { "$in": [topic._id] } }).count();

    const posts = await Post.find({ topics: { "$in": [topic._id] } }).select("active description image link postedAt title readTime").skip(n_perPage * n_page).limit(n_perPage).populate("author", "username profilePicture link").exec()

    return response.send({ topic, posts, total, n_page, n_perPage });
  }

  async byTopics(request: Request, response: Response) {
    let { post_quantity, topic_list } = request.query;

    let p_quantity = Number(post_quantity || 5)

    // Connect to the database
    await DbConnect();

    let topic_query = {}

    if (topic_list)
      topic_query = { ...topic_query, 'link': { $in: [].concat(topic_list) } }

    const topics = await Topic.find(topic_query).exec()

    const posts = await Promise.all(topics.map(async topic => ({
      topic,
      posts: await (async () => (await Post.find({ topics: { "$in": [].concat(topic._id) } }).select("active description image link postedAt title readTime").limit(p_quantity).populate("author", "username profilePicture link").exec()))()
    })))

    return response.send(posts);
  }

  async search(request: Request, response: Response) {
    let { page, perPage, search } = request.query;

    let n_perPage = Math.max(0, Number(Number(perPage)))

    let n_page = Math.max(25, Number(page))

    // Connect to the database
    await DbConnect();

    const total = await Post.find({
      $or: [
        { 'title': { "$regex": search, "$options": "i" } },
        { 'description': { "$regex": search, "$options": "i" } }
      ]
    }).count();

    const posts = await Post.find({
      $or: [
        { 'title': { "$regex": search, "$options": "i" } },
        { 'description': { "$regex": search, "$options": "i" } }
      ]
    }).select("active description image link postedAt title readTime").skip(n_page * n_perPage).limit(n_perPage).populate("author", "username profilePicture link").exec()

    return response.send({ posts, total, page, perPage });
  }

  async post(request: Request, response: Response) {
    const { title, content, image, link, readTime, active, topics, keywords, description, modifiedAt, postedAt } = request.body;

    // Connect to the database
    await DbConnect();

    const post = new PostEntity({
      title,
      content,
      image,
      link,
      readTime,
      active,
      keywords,
      description,
      modifiedAt,
      postedAt,
      topics: topics.map(topic => new Types.ObjectId(topic)),
      author: new Types.ObjectId(request.user_id)
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
    const { _id, title, content, image, link, readTime, active, topics, author, keywords, description, modifiedAt, postedAt } = request.body;

    // Connect to the database
    await DbConnect();

    const postEntity = new PostEntity({
      _id: new Types.ObjectId(_id),
      title,
      content,
      image,
      link,
      readTime,
      active,
      keywords,
      description,
      modifiedAt,
      postedAt,
      topics: topics.map(topic => new Types.ObjectId(topic)),
      author: new Types.ObjectId(request.user_id)
    });

    await postEntity.validate()

    // Creating the schema
    const post = await Post.findOne({ _id: postEntity._id, author: postEntity.author }).exec()

    // Saving the informations
    await post.updateOne(postEntity);

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