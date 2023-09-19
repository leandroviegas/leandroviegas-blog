import React, { useState } from "react"

import { Link } from "@reach/router"
import moment from "moment"

import { BsChatRightText, BsPersonFill, BsThreeDots } from "react-icons/bs"
import { VscClose } from "react-icons/vsc"

import Section from "./Section"
import CreateForm from "@components/Comment/Forms/Create"
import EditForm from "@components/Comment/Forms/Edit"
import Alert from "@components/Alert"

import { useAuth } from "@hooks/Auth"
import api from "@services/api"

import { Comment as CommentClass } from "@classes/blog"
import Outclick from "@components/Outclick"

export class RelatedComment extends CommentClass {
    parentComment?: CommentClass;
}

class CommentProps extends RelatedComment {
    ReloadComments: () => void;
}

const Comment = (comment: CommentProps) => {
    const { cookies, user } = useAuth()

    const [formSelected, setFormSelected] = useState<"edit" | "reply" | "">("")

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const [optionsDrodown, setOptionsDrodown] = useState<boolean>(false)

    const HandleDeleteComment = () => {
        setAlerts({ ...alerts, "comment-errors": [] });

        const headers = { authorization: `Bearer ${cookies.authentication}` }

        api.delete("/posts/comments", { headers, params: { _id: comment._id } }).then(() => {
            comment.ReloadComments()
            setOptionsDrodown(false);
        }).catch(err => {
            console.error(err)
            setAlerts({ ...alerts, "comment-errors": [err?.response?.data?.message || "Erro ao apagar comentário"] })
        })
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg">
            <article className="px-6 py-4 mt-3 text-base">
                <footer className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to={`/blog/user/${comment?.user?.link}`} className="inline-flex items-center gap-2 mr-3 text-gray-900 dark:text-zinc-50 font-semibold">
                            {comment?.user?.profilePicture ?
                                <img className="mr-2 w-6 h-6 rounded-full" src={comment?.user?.profilePicture} alt={comment?.user?.username} />
                                : <BsPersonFill size={20} />}
                            {comment?.user?.username}
                        </Link>
                        <p className="text-xs text-gray-600 dark:text-zinc-400">{moment(comment.postedAt).format('LLL')}</p>
                    </div>
                    <div className="relative h-0">
                        <Outclick callback={() => setOptionsDrodown(false)}>
                            {(user?._id === comment?.user?._id || ["admin"].includes(user?.role)) &&
                                <button onClick={() => setOptionsDrodown(true)} className="py-2 px-4 hover:bg-zinc-100 text-zinc-800 hover:text-zinc-900  dark:hover:bg-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-50 rounded flex items-center gap-1"><BsThreeDots /></button>}
                            {optionsDrodown &&
                                <div className="z-10 absolute right-0 bg-white dark:bg-zinc-800 rounded shadow w-28">
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                        <li className="hover:bg-gray-100 dark:hover:bg-zinc-600">
                                            <button onClick={HandleDeleteComment} className="block gap-2 px-3 py-1 text-left w-full">Apagar</button>
                                        </li>
                                    </ul>
                                </div>}
                        </Outclick>
                    </div>
                </footer>


                {comment.parentComment &&
                    <span className="text-xs dark:text-zinc-400">
                        Mencionou: <span>{comment.parentComment.content?.substring(0, 9)}{comment.parentComment.content.length > 10 && "..."}</span> de&nbsp;
                        <Link className="text-cyan-500 hover:text-cyan-600 hover:underline" to={`/blog/user/${comment.parentComment?.user?.link}`}>
                            @{comment.parentComment?.user?.username}
                        </Link>
                    </span>}

                {formSelected === "edit" ?
                    <EditForm comment_id={comment?._id} initialContent={comment?.content} CommentCallback={() => { comment.ReloadComments(); setFormSelected(""); }}>
                        <button onClick={() => setFormSelected("")} type="button" className="text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400 py-2 rounded-lg text-sm font-medium flex items-center"><VscClose />Cancelar</button>
                    </EditForm>
                    :
                    <p className="text-gray-500 dark:text-gray-300 mt-2">
                        {comment.content !== "" ?
                            <>
                                {comment.content}
                                {comment.postedAt !== comment.modifiedAt &&
                                    <span className="text-xs text-gray-400 italic"> (Mensagem editada)</span>}
                            </>
                            : <span className="text-sm text-gray-400 italic"> (Mensagem apgada)</span>}
                    </p>}

                {formSelected === "" && user?._id &&
                    <div className="flex items-center mt-2 space-x-4">
                        <button onClick={() => setFormSelected("reply")} type="button" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 hover:underline font-medium">
                            <BsChatRightText />
                            Responder
                        </button>
                        {user?._id == comment?.user?._id &&
                            <button onClick={() => setFormSelected("edit")} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 hover:underline font-medium">Editar</button>}
                    </div>}
            </article>

            {alerts["comment-errors"]?.map((message, index) => <Alert key={index} message={message} type="error" />)}

            {formSelected === "reply" &&
                <CreateForm referenceComment={comment?._id} post_id={comment.post} CommentCallback={() => { comment.ReloadComments(); setFormSelected(""); }}>
                    <button onClick={() => setFormSelected("")} type="button" className="text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400 py-2 rounded-lg text-sm font-medium flex items-center"><VscClose />Cancelar</button>
                </CreateForm>}
        </div >
    )
}

Comment.Section = Section;

Comment.Create = CreateForm;
Comment.Edit = EditForm;

export default Comment