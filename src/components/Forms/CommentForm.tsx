import React, { ReactNode } from "react"
import api from "@services/api"
import { useState } from "react"
import { useAuth } from "@hooks/Auth"
import Alert from "@components/Alert"

import { BiPaperPlane } from 'react-icons/bi'

type CommentFormProps = {
    post_id: string;
    referenceComment: string;
    children?: ReactNode;
    CommentCallback: () => void;
}

const CommentForm = ({ post_id, referenceComment, CommentCallback, children }: CommentFormProps) => {
    const { cookies } = useAuth()

    const [content, setContent] = useState("")

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const HandleComment = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()

        const headers = { authorization: `Bearer ${cookies.authentication}` }

        api.post("/posts/comments", { post: post_id, referenceComment, content }, { headers }).then(() => {
            setContent("")
            CommentCallback()
        }).catch(err => {
            console.error(err)
            setAlerts({ ...alerts, "comment-errors": [err?.response?.data?.message || "Erro ao comentar"] })
        })
    }

    return (
        <div className="px-6 py-2 bg-white rounded-lg">
            {alerts["comment-errors"]?.map((message, index) => <Alert key={index} message={message} type="error" />)}
            <form onSubmit={HandleComment}>
                <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-12 rounded-lg resize-none py-2 text-zinc-600 outline-none" placeholder={referenceComment ? "Responder" : "Escreva um comentário"} />
                <hr />
                <div className="my-2 flex items-center gap-4" >
                    <button type={content.trim() ? "submit" : "button"} className="text-gray-500  text-sm hover:text-gray-600 py-2 rounded-lg font-medium flex items-center gap-1"><BiPaperPlane />{referenceComment ? "Responder" : "Comentar"}</button>
                    {children}
                </div>
            </form>
        </div>
    )
}

export default CommentForm