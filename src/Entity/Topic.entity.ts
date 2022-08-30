import { Types } from "mongoose";
import { Topic } from "../Model/Topic.model";
import dbConnect from "../utils/dbConnect";

export default class TopicEntity {
    readonly _id?: Types.ObjectId;

    readonly name: string;

    readonly link: string;

    readonly description: string;

    readonly image?: string;

    // Validation function
    async validate?() {
        // Connect to the database
        await dbConnect()

        if (!(this.name?.length >= 4)) throw new Error("topic/name/length-lower-than-4")

        if ((await Topic.find({ _id: { $ne: this._id }, link: this.link }).exec()).length > 0)
            throw new Error("topic/link/alredy-in-use")
    }

    constructor({ _id, name, link, description, image }: TopicEntity) {
        this._id = _id;
        this.name = name;
        this.link = link;
        this.description = description;
        this.image = image;
    }
}