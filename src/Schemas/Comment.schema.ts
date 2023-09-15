import { Schema } from "mongoose";

let CommentSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: [true, "user/user-is-required"]
    },
    post: {
        ref: 'posts',
        type: Schema.Types.ObjectId,
        required: [true, "post/post-is-required"]
    },
    referenceComment: {
        ref: 'comments',
        type: Schema.Types.ObjectId,
    },
    content: {
        type: String,
        required: [true, "content/content-is-required"]
    },
    modifiedAt: { type: Date, default: Date.now },
    postedAt: { type: Date, default: Date.now },
});

export default CommentSchema;