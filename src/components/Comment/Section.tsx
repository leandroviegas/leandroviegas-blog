import React from "react"

import { Comment as CommentClass } from "@classes/blog"
import Comment, { RelatedComment } from ".";


type CommentProps = {
    comments: CommentClass[];
    ReloadComments: () => void
}

const Section = ({ comments, ReloadComments }: CommentProps) => {
    return (
        <>
            {comments?.filter(comment => !comment?.referenceComment)?.map(comment => {
                let relatedComments: RelatedComment[] = []

                function getRelatedComments(referenceComment: CommentClass) {
                    comments?.filter(thisComment => referenceComment._id == thisComment.referenceComment)?.forEach(parentComment => {
                        relatedComments.push({ ...parentComment, parentComment: comments.find(cmnt => cmnt._id === parentComment.referenceComment) })
                        getRelatedComments(parentComment);
                    })
                }

                getRelatedComments(comment);

                return (
                    <React.Fragment key={comment?._id}>
                        <Comment ReloadComments={ReloadComments} {...comment} />
                        <div className="border-l-2 border-gray-600 dark:border-gray-300 ml-6 pl-3">
                            {relatedComments.map(comment => <Comment ReloadComments={ReloadComments} key={comment._id} {...comment} />)}
                        </div>
                    </React.Fragment>
                )
            })}

        </>
    )
}

export default Section