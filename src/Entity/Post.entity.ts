import { Types } from "mongoose";
import { Post } from "../Model/Post.model";
import dbConnect from "../utils/dbConnect";

export default class PostEntity {
    readonly _id?: Types.ObjectId;

    readonly title: string;

    readonly content: string;

    readonly image?: string;

    readonly link: string;

    readonly readTime: number;

    readonly active: boolean;

    readonly topics: Types.ObjectId[];

    readonly author: Types.ObjectId;

    readonly keywords: string;

    readonly description: string;

    readonly modifiedAt: Date;

    readonly postedAt: Date;

    // Validation function
    async validate?() {
        // Connect to the database
        await dbConnect()

        if (!(this.title?.length >= 4)) throw new Error("post/title/length-lower-than-4")

        if ((await Post.find({ _id: { $ne: this._id }, link: this.link }).exec()).length > 0)
            throw new Error("post/link/alredy-in-use")
    }

    constructor({ _id, title, image, content, description, keywords, link, modifiedAt, postedAt, readTime, active, author, topics }: PostEntity) {
        this._id = _id;
        this.author = author;
        this.topics = topics;
        this.title = title;
        this.content = content;
        this.image = image;
        this.link = link;
        this.readTime = readTime;
        this.active = active;
        this.keywords = keywords;
        this.description = description;
        this.modifiedAt = modifiedAt;
        this.postedAt = postedAt;
    }
}