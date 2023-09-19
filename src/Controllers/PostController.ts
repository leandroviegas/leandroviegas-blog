import { Request, Response } from "express";
import { Types } from "mongoose";
import { Topic } from "@Models/Topic.model";
import { Post } from "@Models/Post.model";
import ImageProcessing from "@utils/ImageProcessing";
import { User } from "@Models/User.model";

class PostController {
  async list(request: Request, response: Response) {
    const { } = request.query;

    const posts = await Post.find({}).select("").exec()

    return response.send({ posts })
  }

  async get(request: Request, response: Response) {
    const { _id, link } = request.query;

    const post = await Post.findOne({ $or: [{ _id }, { link }] }).populate('author', 'username link role about profilePicture github linkedin ocupation').exec()

    if (post) {
      return response.send({ post: post.toJSON() });
    }
    else
      throw new Error("posts/not-found")
  }

  async byTopic(request: Request, response: Response) {
    let { perPage, topic_link, page } = request.query;

    let n_perPage = Math.max(0, Number(perPage))

    let n_page = Math.max(25, Number(page))

    const topic = await Topic.findOne({ 'link': { $in: topic_link } }).exec()

    const total = await Post.find({ topics: { "$in": [topic._id] } }).count();

    const posts = await Post.find({ topics: { "$in": [topic._id] } }).select("active description image link postedAt title readTime").skip(n_perPage * n_page).limit(n_perPage).populate("author", "username profilePicture link").exec()

    return response.send({ topic, posts, total, n_page, n_perPage });
  }

  async byAuthor(request: Request, response: Response) {
    let { perPage, user_link, page } = request.query;

    let n_perPage = Math.max(0, Number(perPage))

    let n_page = Math.max(25, Number(page))

    const user = await User.findOne({ 'link': user_link }).select("username profilePicture link ocupation github linkedin about email").exec()

    if (!user) throw new Error("user/not-found");

    const total = await Post.find({ author: user._id }).count();

    const posts = await Post.find({ author: user._id }).select("active description image link postedAt title readTime").skip(n_perPage * n_page).limit(n_perPage).populate("author", "username profilePicture link").exec()

    return response.send({ user, posts, total, n_page, n_perPage });
  }

  async byTopics(request: Request, response: Response) {
    let { post_quantity, topic_list } = request.query;

    let p_quantity = Number(post_quantity || 5)

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
    let image = "";
    const { title, content, link, readTime, active, topics, keywords, description, modifiedAt, postedAt, author, imageFile } = Object.assign(
      {
        ...request.body,
        topics: JSON.parse(request.body.topics),
        modifiedAt: new Date(request.body.modifiedAt),
        postedAt: new Date(request.body.postedAt),
        readTime: Number(request.body.readTime),
        active: Boolean(request.body.active),
        imageFile: request.file
      },
      {
        _id: undefined,
        author: new Types.ObjectId(request.user_id)
      }
    );

    if (imageFile != null && typeof imageFile != 'string')
      image = await ImageProcessing({ image: imageFile, height: 400, width: 1000 });

    const post = await new Post({ title, image, content, description, keywords, link, modifiedAt, postedAt, readTime, active, author, topics }).save();

    return response.send({ post: post.toJSON() });
  }

  async update(request: Request, response: Response) {
    let image = request.body.image;
    const { _id, title, content, link, readTime, active, topics, keywords, description, modifiedAt, postedAt, imageFile, author } = Object.assign(
      {
        ...request.body,
        topics: JSON.parse(request.body.topics),
        modifiedAt: new Date(request.body.modifiedAt),
        postedAt: new Date(request.body.postedAt),
        readTime: Number(request.body.readTime),
        active: Boolean(request.body.active),
        imageFile: request.file
      },
      {
        author: new Types.ObjectId(["admin"].includes(request.user_role) ? request.user_id : request.body.author)
      });

    let post

    if (["admin"].includes(request.user_role)) {
      post = await Post.findById(_id).exec()
    } else {
      post = await Post.findOne({ _id, author: request.user_id }).exec()
    }

    if (!post) throw Error("post/not-found")

    if (imageFile != null && typeof imageFile != 'string')
      image = await ImageProcessing({ image: imageFile, height: 400, width: 1000 });

    await post.set({ _id, title, image, content, description, keywords, link, modifiedAt, postedAt, readTime, active, author, topics }).save();

    return response.send({ post: post.toJSON() });
  }

  async delete(request: Request, response: Response) {
    const { _id } = request.query;

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