import { Request, Response } from "express";
import TopicEntity from "../Entity/Topic.entity";
import { Topic } from "../Model/Topic.model";
import DbConnect from "../utils/dbConnect";

class TopicController {
  async list(request: Request, response: Response) {
    const { } = request.query;

    // Connect to the database
    await DbConnect();

    // Get the topics
    const topics = await Topic.find({}).select("-password").exec()

    return response.send({ topics })
  }

  async get(request: Request, response: Response) {
    const { _id, link } = request.query;

    // Connect to the database
    await DbConnect();

    const post = await Topic.findOne({ $or: [{ _id }, { link }] }).select("").exec()

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

    const topicEntity = new TopicEntity({ name, link, description, image });

    // Validating the informations
    await topicEntity.validate()

    // Creating the schema
    const topic = new Topic(topicEntity);

    // Saving the informations
    await topic.save();

    let topicJSON = topic.toJSON()

    // Return the data
    return response.send({ topic: topicJSON });
  }

  async update(request: Request, response: Response) {
    const { _id, name, link, description, image } = request.body;

    // Connect to the database
    await DbConnect();

    const topicEntity = new TopicEntity({ _id, name, link, description, image });

    // Validating the informations
    await topicEntity.validate()

    // Find topic
    const topic = await Topic.findById(_id).exec()

    // Updating the fields
    topic.set(topicEntity)

    // Saving the informations
    await topic.save();

    let topicJSON = topic.toJSON()

    // Return the data
    return response.send({ topic: topicJSON });
  }

  async delete(request: Request, response: Response) {
    const { _id } = request.query;

    // Connect to the database
    await DbConnect();

    // If is _id string
    if (typeof _id !== 'string')
      throw new Error("topic/id/invalid-id")

    // tje function "ConvertId" also verify if the id is valid
    const topic = await Topic.findById(_id).exec()

    // Verifiy if found the topic
    if (!topic)
      throw new Error("topic/not-found")

    // Removing the topic
    await topic.remove()

    return response.send({ topic: topic.toJSON() });
  }
}

export { TopicController };