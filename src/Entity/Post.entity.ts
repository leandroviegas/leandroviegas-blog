import { Types } from "mongoose";
import { Post } from "@Models/Post.model";
import ConnectDB from "@utils/ConnectDB";

export default class PostEntity {
    // Validation function
    async validate?() {
        // Connect to the database
        await ConnectDB()

        if (!(this.title?.length >= 4)) throw new Error("post/title/length-lower-than-4")

        if ((await Post.find({ _id: { $ne: this._id }, link: this.link }).exec()).length > 0)
            throw new Error("post/link/alredy-in-use")
    }

    constructor(
        readonly _id: Types.ObjectId,
        readonly title: string,
        readonly image: string,
        readonly content: string,
        readonly description: string,
        readonly keywords: string,
        readonly link: string,
        readonly modifiedAt: Date,
        readonly postedAt: Date,
        readonly readTime: number,
        readonly active: boolean,
        readonly author: Types.ObjectId,
        readonly topics: Types.ObjectId[]
    ) { 
    }
}