import { Request, Response } from "express";
import { Topic } from "@Models/Topic.model";

class TopicController {
  async list(request: Request, response: Response) {
    const { } = request.query;

    const topics = await Topic.find({}).select("-password").exec()

    return response.send({ topics })
  }

  async get(request: Request, response: Response) {
    const { _id, link } = request.query;

    const post = await Topic.findOne({ $or: [{ _id }, { link }] }).select("").exec()

    if (post) {
      return response.send({ post: post.toJSON() });
    }
    else
      throw new Error("posts/not-found")
  }

  async post(request: Request, response: Response) {
    const { name, link, description, image } = Object.assign({ _id: undefined }, request.body);

    const topic = await new Topic({ name, link, description, image }, { runValidators: true }).save();

    return response.send({ topic: topic.toJSON() });
  }

  async update(request: Request, response: Response) {
    const { _id, name, link, description, image } = request.body;

    const topic = await Topic.findByIdAndUpdate(_id, { name, link, description, image }, { runValidators: true, new: true }).exec()

    return response.send({ topic: topic.toJSON() });
  }

  async delete(request: Request, response: Response) {
    const { _id } = request.query;

    const topic = await Topic.findById(_id).exec()

    if (!topic)
      throw new Error("topic/not-found")

    await topic.remove()

    return response.send({ topic: topic.toJSON() });
  }
}

export { TopicController };