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
        const { user, post, referenceComment, content } = Object.assign(request.body,
            {
                user: new Types.ObjectId(request.user_id),
                post: new Types.ObjectId(request.body.post.toString()),
                referenceComment: Types.ObjectId.isValid(request.body.referenceComment) ? new Types.ObjectId(request.body.referenceComment) : null,
            });

        const comment = await new Comment({ _id: new Types.ObjectId(), user, post, referenceComment, content, modifiedAt: new Date(), postedAt: new Date() }, { runValidators: true }).save();

        return response.send({ comment: comment.toJSON() });
    }

    async put(request: Request, response: Response) {
        const { _id, content } = request.body;

        const comment = await Comment.findOneAndUpdate({ _id, user: request.user_id }, { content, modifiedAt: new Date() }, { runValidators: true });

        return response.send({ comment: comment.toJSON() });
    }

    async delete(request: Request, response: Response) {
        const { _id } = request.query;

        let comment

        if (!["admin"].includes(request.user_role)) {
            comment = await Comment.findById(_id).exec()
        } else {
            comment = await Comment.findOne({ _id, user: request.user_id }).exec()
        }

        if (!comment)
            throw new Error("comment/not-found")

        let postComments = await Comment.find({ referenceComment: comment._id, _id: { $ne: comment._id } }).exec()

        if (postComments.length > 0)
            await Comment.findByIdAndUpdate(comment._id, { content: "" }, { runValidators: false }).exec()
        else
            await comment.remove()

        return response.send({});
    }
}