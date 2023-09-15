import { Request, Response } from "express";
import { Types } from "mongoose";
import { Comment } from "@Models/Comment.model";

export class CommentController {
    async list(request: Request, response: Response) {
        const { post_id } = request.query;
        
        const comments = await Comment.find({ post: new Types.ObjectId(post_id.toString()) }).populate("user", "username profilePicture link").exec()

        return response.send({ comments });
    }

    async post(request: Request, response: Response) {
        const { post, referenceComment, content } = request.body;

        const comment = await new Comment({ _id: request.user_id, post, referenceComment, content, modifiedAt: new Date(), postedAt: new Date() }, { runValidators: true }).save();

        return response.send({ comment: comment.toJSON() });
    }

    async put(request: Request, response: Response) {
        const { _id, content } = request.body;

        const comment = await Comment.findOneAndUpdate({ _id, user: request.user_id }, { content, modifiedAt: new Date() }, { runValidators: true });

        return response.send({ comment: comment.toJSON() });
    }

    async delete(request: Request, response: Response) {
        const { _id } = request.query;

        let post

        if (!["admin"].includes(request.user_role)) {
            post = await Comment.findById(_id).exec()
        } else {
            post = await Comment.findOne({ _id, user: request.user_id }).exec()
        }

        if (!post)
            throw new Error("comment/not-found")

        await post.remove()

        return response.send({ post: post.toJSON() });
    }
}