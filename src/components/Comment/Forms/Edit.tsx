import React, { ReactNode } from "react"
import api from "@services/api"
import { useState } from "react"
import { useAuth } from "@hooks/Auth"
import Alert from "@components/Alert"

import { BiPaperPlane } from 'react-icons/bi'

class CommentEditProps {
    comment_id?: string;
    initialContent: string;
    children?: ReactNode;
    CommentCallback: () => void;
}

const CommentForm = ({ comment_id, initialContent, CommentCallback, children }: CommentEditProps) => {
    const { cookies, user } = useAuth()

    const [content, setContent] = useState(initialContent)

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const HandleComment = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        setAlerts({ ...alerts, "comment-errors": [] });

        const headers = { authorization: `Bearer ${cookies.authentication}` }

        api.put(`/posts/comments`, { _id: comment_id, content }, { headers }).then(() => {
            setContent("")
            CommentCallback()
        }).catch(err => {
            console.error(err)
            setAlerts({ ...alerts, "comment-errors": [err?.response?.data?.message || "Erro ao comentar"] })
        })
    }

    return (
        <>
            {user?._id ?
                <div className="bg-white dark:bg-zinc-900 rounded-lg">
                    {alerts["comment-errors"]?.map((message, index) => <Alert key={index} message={message} type="error" />)}
                    <form onSubmit={HandleComment}>
                        <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-12 rounded-lg resize-none py-2 bg-transparent text-zinc-600 dark:text-zinc-300 outline-none" placeholder="Escreva um comentário" />
                        <hr />
                        <div className="flex items-center gap-4" >
                            <button type={content.trim() ? "submit" : "button"} className="text-gray-500 text-sm hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400 py-2 rounded-lg font-medium flex items-center gap-1">
                                <BiPaperPlane size={18} />Editar
                            </button>
                            {children}
                        </div>
                    </form>
                </div> :
                <></>}
        </>
    )
}

export default CommentForm