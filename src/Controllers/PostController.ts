import { Request, Response } from "express";
import { Types } from "mongoose";
import PostEntity from "@Entity/Post.entity";
import { Topic } from "@Models/Topic.model";
import { Post } from "@Models/Post.model";
import ConnectDB from "@utils/ConnectDB";

class PostController {
  async list(request: Request, response: Response) {
    const { } = request.query;

    await ConnectDB();

    const posts = await Post.find({}).select("").exec()

    return response.send({ posts })
  }

  async get(request: Request, response: Response) {
    const { _id, link } = request.query;

    await ConnectDB();

    const post = await Post.findOne({ $or: [{ _id }, { link }] }).populate('author', 'username link role about profilePicture').exec()

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

    await ConnectDB();

    const topic = await Topic.findOne({ 'link': { $in: topic_link } }).exec()

    const total = await Post.find({ topics: { "$in": [topic._id] } }).count();

    const posts = await Post.find({ topics: { "$in": [topic._id] } }).select("active description image link postedAt title readTime").skip(n_perPage * n_page).limit(n_perPage).populate("author", "username profilePicture link").exec()

    return response.send({ topic, posts, total, n_page, n_perPage });
  }

  async byTopics(request: Request, response: Response) {
    let { post_quantity, topic_list } = request.query;

    let p_quantity = Number(post_quantity || 5)

    await ConnectDB();

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
    await ConnectDB();

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
    const { _id, title, content, image, link, readTime, active, topics, keywords, description, modifiedAt, postedAt, author } = Object.assign(
      request.body,
      {
        _id: undefined,
        author: new Types.ObjectId(request.user_id)
      }
    );

    await ConnectDB();

    const post = new PostEntity(
      _id,
      title,
      image,
      content,
      description,
      keywords,
      link,
      modifiedAt,
      postedAt,
      readTime,
      active,
      author,
      topics.map(topic => new Types.ObjectId(topic)) // Topics
    );

    await post.validate()

    const PostS = new Post(post);

    await PostS.save();

    let postJSON = PostS.toJSON();

    return response.send({ post: postJSON });
  }

  async update(request: Request, response: Response) {
    const { _id, title, content, image, link, readTime, active, topics, keywords, description, modifiedAt, postedAt, author } = Object.assign(
      request.body,
      {
        author: new Types.ObjectId(!["admin"].includes(request.user_role) ? request.user_id : request.body.author)
      });

    await ConnectDB();

    const postEntity = new PostEntity(
      _id,
      title,
      image,
      content,
      description,
      keywords,
      link,
      modifiedAt,
      postedAt,
      readTime,
      active,
      author,
      topics.map(topic => new Types.ObjectId(topic)) // Topics
    );

    await postEntity.validate()

    let post

    if (["admin"].includes(request.user_role)) {
      post = await Post.findById(_id).exec()
    } else {
      post = await Post.findOne({ _id, author: request.user_id }).exec()
    }

    if (!post) throw Error("post/not-found")

    post.set(postEntity);

    await post.save();

    let postJSON = post.toJSON();

    return response.send({ post: postJSON });
  }

  async delete(request: Request, response: Response) {
    const { _id } = request.query;

    await ConnectDB();

    let post

    if (["admin"].includes(request.user_role)) {
      post = await Post.findById(_id).exec()
    } else {
      post = await Post.findOne({ _id, author: request.user_id }).exec()
    }

    if (!post)
      throw new Error("post/not-found")

    await post.remove()

    return response.send({ post: post.toJSON() });
  }
}

export { PostController };