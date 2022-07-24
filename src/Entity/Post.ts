import { Types } from "mongoose";
import { Post, PostModelT } from "../Model/PostModel";
import dbConnect from "../utils/dbConnect";

class PostEntity {
    readonly _id?: Types.ObjectId;

    readonly title: string;

    readonly content: string;

    readonly image?: string;

    readonly link: string;

    readonly readTime: number;

    readonly active: boolean;

    readonly category: Types.ObjectId;

    readonly author: Types.ObjectId;

    readonly keywords: string;

    readonly description: string;

    readonly modifiedAt: Date;

    readonly postedAt: Date;

    // Validation function
    async validate() {
        // Connect to the database
        await dbConnect()

        if (!(this.title?.length >= 4)) throw new Error("post/title/length-lower-than-4")

        if ((await Post.find({ _id: { $ne: this._id }, link: this.link }).exec()).length > 0)
            throw new Error("post/link/alredy-in-use")
    }

    constructor({ _id, title, image, content, description, keywords, link, modifiedAt, postedAt, readTime, active, author, category }: Omit<PostModelT, "active" | "author" | "category"> & { _id?: string, author: string, category: string, active?: boolean }) {
        if (_id)
            this._id = new Types.ObjectId(_id);
        this.author = new Types.ObjectId(author);
        this.category = new Types.ObjectId(category);

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

export default PostEntity;