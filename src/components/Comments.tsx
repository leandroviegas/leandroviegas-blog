import moment from "moment"
import React, { useState } from "react"
import { BiPaperPlane } from "react-icons/bi"
import { BsPersonFill } from "react-icons/bs"
import { VscClose } from "react-icons/vsc"
import { Comment as CommentT } from "types/blog.type"
import CommentForm from "./Forms/CommentForm"
import { Link } from "@reach/router"
import { useAuth } from "@hooks/Auth"
import { FaTrash } from "react-icons/fa"
import api from "@services/api"
import Alert from "./Alert"

type CommentProps = {
    comments: CommentT[];
    ReloadComments: () => void
}

type RelatedCommentT = CommentT & { relatedComment?: CommentT }

const Comment = (comment: RelatedCommentT & { ReloadComments: () => void }) => {
    const { cookies, user } = useAuth()

    const [reply, setReply] = useState(false);

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const HandleDeleteComment = () => {
        const headers = { authorization: `Bearer ${cookies.authentication}` }

        api.delete("/posts/comments", { headers, params: { _id: comment._id } }).then(() => {
            comment.ReloadComments()
        }).catch(err => {
            console.error(err)
            setAlerts({ ...alerts, "comment-errors": [err?.response?.data?.message || "Erro ao apagar comentário"] })
        })
    }

    return (
        <div className="bg-white rounded-lg">
            <article className="px-6 py-4 mt-3 text-base">
                <footer className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to={`/user/${comment?.user?.link}`} className="inline-flex items-center gap-2 mr-3 text-gray-900 font-semibold">
                            {comment?.user?.profilePicture ?
                                <img className="mr-2 w-6 h-6 rounded-full" src={comment?.user?.profilePicture} alt={comment?.user?.username} />
                                : <BsPersonFill size={20} />}
                            {comment?.user?.username}
                        </Link>
                        <p className="text-xs text-gray-600">{moment(comment.postedAt).format('LLL')}</p>
                    </div>
                    <button onClick={HandleDeleteComment} className="py-2 px-4 hover:bg-red-100 text-red-800 hover:text-red-900 rounded flex items-center gap-1"><FaTrash />Apagar</button>
                </footer>
                {comment.relatedComment && (comment.relatedComment?.user?._id !== user?._id || ["admin"].includes(user.role)) &&
                    <span className="text-xs">Mencionou: <Link className="text-cyan-500 hover:text-cyan-600 hover:underline" to={`/user/${comment.relatedComment?.user?.link}`}>@{comment.relatedComment?.user?.username}</Link></span>}
                <p className="text-gray-500 mt-2">{comment.content} {comment.postedAt !== comment.modifiedAt && <span className="text-xs text-gray-400 italic">(Mensagem editada)</span>}</p>
                {!reply &&
                    <div className="flex items-center mt-2 space-x-4">
                        <button onClick={() => setReply(true)} type="button" className="flex items-center gap-2 text-sm text-gray-500 hover:underline font-medium">
                            <BiPaperPlane />
                            Responder
                        </button>
                        {user?._id == comment?.user?._id &&
                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:underline font-medium">Editar</button>}
                    </div>}
            </article>
            {alerts["comment-errors"]?.map((message, index) => <Alert key={index} message={message} type="error" />)}
            {reply &&
                <>
                    <CommentForm referenceComment={comment?._id} post_id={comment.post} CommentCallback={() => { comment.ReloadComments(); setReply(false); }}>
                        <button onClick={() => setReply(false)} type="button" className="text-gray-500 hover:text-gray-600 py-2 rounded-lg text-sm font-medium flex items-center"><VscClose />Cancelar</button>
                    </CommentForm>
                </>}
        </div>
    )
}



const CommentsSection = ({ comments, ReloadComments }: CommentProps) => {
    return (
        <>
            {comments?.filter(comment => !comment?.referenceComment)?.map(comment => {
                let relatedComments: RelatedCommentT[] = []

                function getRelatedComments(referenceComment: CommentT) {
                    comments?.filter(thisComment => referenceComment._id == thisComment.referenceComment)?.forEach(relatedComment => {
                        relatedComments.push({ ...relatedComment, relatedComment })
                        getRelatedComments(relatedComment);
                    })
                }

                getRelatedComments(comment);

                return (
                    <React.Fragment key={comment?._id}>
                        <Comment ReloadComments={ReloadComments} {...comment} />
                        <div className="border-l-2 border-gray-600 ml-6 pl-3">
                            {relatedComments.map(comment => <Comment ReloadComments={ReloadComments} key={comment._id} {...comment} />)}
                        </div>
                    </React.Fragment>
                )
            })}

        </>
    )
}

export default CommentsSection