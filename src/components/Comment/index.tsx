import React, { useState } from "react"

import { Link } from "@reach/router"
import moment from "moment"

import { BsChatRightText, BsPersonFill } from "react-icons/bs"
import { VscClose } from "react-icons/vsc"
import { FaTrash } from "react-icons/fa"

import Section from "./Section"
import CommentForm from "@components/Comment/Form"
import Alert from "@components/Alert"
import Form from "@components/Comment/Form"

import { useAuth } from "@hooks/Auth"
import api from "@services/api"

import { Comment as CommentClass } from "@classes/blog"

export class RelatedComment extends CommentClass {
    parentComment?: CommentClass;
}

class CommentProps extends RelatedComment {
    ReloadComments: () => void;
}

const Comment = (comment: CommentProps) => {
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

    const HandleEditComment = () => {
        const headers = { authorization: `Bearer ${cookies.authentication}` }

        api.put("/posts/comments", { headers, params: { _id: comment._id } }).then(() => {
            comment.ReloadComments()
        }).catch(err => {
            console.error(err)
            setAlerts({ ...alerts, "comment-errors": [err?.response?.data?.message || "Erro ao editar comentário"] })
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

                    {user?._id == comment?.user?._id || ["admin"].includes(user?.role) &&
                        < button onClick={HandleDeleteComment} className="py-2 px-4 hover:bg-red-100 text-red-800 hover:text-red-900 rounded flex items-center gap-1"><FaTrash />Apagar</button>}
                </footer>


                {comment.parentComment && (comment.parentComment?.user?._id !== user?._id) &&
                    <span className="text-xs">
                        Mencionou:
                        <Link className="text-cyan-500 hover:text-cyan-600 hover:underline" to={`/user/${comment.parentComment?.user?.link}`}>
                            @{comment.parentComment?.user?.username}
                        </Link>
                    </span>}

                <p className="text-gray-500 mt-2">
                    {comment.content}
                    {comment.postedAt !== comment.modifiedAt &&
                        <span className="text-xs text-gray-400 italic">(Mensagem editada)</span>}
                </p>

                {!reply &&
                    <div className="flex items-center mt-2 space-x-4">
                        <button onClick={() => setReply(true)} type="button" className="flex items-center gap-2 text-sm text-gray-500 hover:underline font-medium">
                            <BsChatRightText />
                            Responder
                        </button>
                        {user?._id == comment?.user?._id &&
                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:underline font-medium">Editar</button>}
                    </div>}
            </article>

            {alerts["comment-errors"]?.map((message, index) => <Alert key={index} message={message} type="error" />)}

            {reply &&
                <CommentForm referenceComment={comment?._id} post_id={comment.post} CommentCallback={() => { comment.ReloadComments(); setReply(false); }}>
                    <button onClick={() => setReply(false)} type="button" className="text-gray-500 hover:text-gray-600 py-2 rounded-lg text-sm font-medium flex items-center"><VscClose />Cancelar</button>
                </CommentForm>}
        </div >
    )
}

Comment.Section = Section;

Comment.Form = Form;

export default Comment