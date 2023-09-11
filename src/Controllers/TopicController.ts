import { Request, Response } from "express";
import TopicEntity from "../Entity/Topic.entity";
import { Topic } from "../Model/Topic.model";
import DbConnect from "../utils/dbConnect";

class TopicController {
  async list(request: Request, response: Response) {
    const { } = request.query;

    await DbConnect();

    const topics = await Topic.find({}).select("-password").exec()

    return response.send({ topics })
  }

  async get(request: Request, response: Response) {
    const { _id, link } = request.query;

    await DbConnect();

    const post = await Topic.findOne({ $or: [{ _id }, { link }] }).select("").exec()

    if (post) {
      return response.send({ post: post.toJSON() });
    }
    else
      throw new Error("posts/not-found")
  }

  async post(request: Request, response: Response) {
    const { _id, name, link, description, image } = Object.assign({ _id: undefined }, request.body);

    await DbConnect();

    const topicEntity = new TopicEntity(_id, name, link, description, image);

    await topicEntity.validate()

    const topic = new Topic(topicEntity);

    await topic.save();

    let topicJSON = topic.toJSON()
  
    return response.send({ topic: topicJSON });
  }

  async update(request: Request, response: Response) {
    const { _id, name, link, description, image } = request.body;

    await DbConnect();

    const topicEntity = new TopicEntity( _id, name, link, description, image);

    await topicEntity.validate()

    const topic = await Topic.findById(_id).exec()

    topic.set(topicEntity)

    await topic.save();

    let topicJSON = topic.toJSON()

    return response.send({ topic: topicJSON });
  }

  async delete(request: Request, response: Response) {
    const { _id } = request.query;

    await DbConnect();

    if (typeof _id !== 'string')
      throw new Error("topic/id/invalid-id")

    const topic = await Topic.findById(_id).exec()

    if (!topic)
      throw new Error("topic/not-found")

    await topic.remove()

    return response.send({ topic: topic.toJSON() });
  }
}

export { TopicController };