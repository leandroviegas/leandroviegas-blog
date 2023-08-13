import React, { useEffect, useState } from "react"

import { useAuth } from "../../hooks/Auth";
import linkfy from "../../utils/linkfy";
import api from "../../services/api";
import FloatingLabelInput from "./Inputs/FloatingLabelInput";
import Alert from "../Alert";

import { Topic } from "../../types/blog.type";

import { IoIosClose } from "react-icons/io";
import { VscLoading } from "react-icons/vsc";

type Status = "loading" | "success" | "error" | "input-warnings" | "";

interface TopicForm {
    topic: Topic;
    onClose: () => void;
    onSuccess: () => void;
}

const TopicForm = ({ topic, onClose, onSuccess }) => {
    const { cookies } = useAuth()

    const [status, setStatus] = useState<Status>("")

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({ "topic-form": [] })

    const [form, setForm] = useState<Topic>(topic)

    const HandleSaveTopic = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        if (status === "loading") return;

        if (["topic-form-name", "topic-form-link"].some(input => alerts[input]?.length > 0)) {
            setStatus("input-warnings");
        } else {
            setStatus("loading");
            try {
                let headers = { authorization: `Bearer ${cookies.authentication}` }
                
                if (form?._id) {
                    await api.put("/topics", form, { headers })
                } else {
                    await api.post("/topics", form, { headers })
                }

                onSuccess()
            } catch (err) {
                console.error(err)
                setStatus("error");
                setAlerts({ ...alerts, "topic-form": [err?.response?.data?.message || `Ocorreu um erro ao ${form?._id ? "editar" : "adicionar"} tópico!`] })
            }
        }
    }

    useEffect(() => {
        if (!(form.name.length > 0))
            setAlerts(a => ({ ...a, "topic-form-name": [`Nome é obrigatório`] }))
        else if (!(form.name.length > 3))
            setAlerts(a => ({ ...a, "topic-form-name": [`Nome deve ter no mínimo 3 caracteres`] }))
        else
            setAlerts(a => ({ ...a, "topic-form-name": [] }))

        if (!(form.link.length > 0))
            setAlerts(a => ({ ...a, "topic-form-link": [`Link é obrigatório`] }))
        else if (!(form.link.length > 3))
            setAlerts(a => ({ ...a, "topic-form-link": [`Link deve ter no mínimo 3 caracteres`] }))
        else if (form.link.endsWith("-"))
            setAlerts(a => ({ ...a, "topic-form-link": [`Link não pode terminar em "-"`] }))
        else
            setAlerts(a => ({ ...a, "topic-form-link": [] }))
    }, [form])

    return (
        <>
            <div className="flex gap-2 justify-between items-center rounded-t-lg bg-indigo-600 text-white py-3">
                <h1 className="px-4 text-xl font-bold text-white">{form?._id ? `Editar tópico - ${form.name}` : "Novo tópico"}</h1>
                <button onClick={onClose} className="mx-2 hover:opacity-90 transition hover:scale-110">
                    <IoIosClose size={35} />
                </button>
            </div>
            <form onSubmit={HandleSaveTopic} className="m-6">
                {alerts["topic-form"]?.map(message => <Alert key={message} type="error" message={message} />)}
                <div className="my-5">
                    <FloatingLabelInput label="Nome" name="name" defaultValue={form.name} onChange={evt => setForm({ ...form, name: evt.target.value, link: linkfy(evt.target.value) })} status={(status === "input-warnings" && alerts["topic-form-name"]?.length > 0) ? "error" : "info"} messages={alerts["topic-form-name"]} />
                </div>
                <div className="my-5">
                    <FloatingLabelInput label="Link" name="link" value={form.link} onChange={evt => setForm({ ...form, link: linkfy(evt.target.value) })} status={(status === "input-warnings" && alerts["topic-form-link"]?.length > 0) ? "error" : "info"} messages={alerts["topic-form-link"]} />
                </div>
                <div className="my-5">
                    <FloatingLabelInput label="Descrição" name="description" type="textarea" value={form.description} onChange={evt => setForm({ ...form, description: evt.currentTarget.value })} status={(status === "input-warnings" && alerts["topic-form-description"]?.length > 0) ? "error" : "info"} messages={alerts["topic-form-description"]} />
                </div>
                <hr className="my-4" />
                <div className="flex items-center justify-between gap-6 flex-wrap">
                    <button type="submit" className="bg-indigo-500 hover:bg-indigo-700 shadow-lg shadow-indigo-700/30 rounded-xl text-white py-2 px-4 hover:scale-105 transition font-semibold">
                        {status === "loading" ? <VscLoading className="animate-spin text-lg mx-6 my-0.5" /> : form?._id ? `Salvar informações` : "Adicionar tópico"}
                    </button>
                    <button type="button" onClick={onClose} className="py-2 transition px-4 text-zinc-800 bg-zinc-200 hover:bg-zinc-300 font-semibold rounded-lg">Cancelar</button>
                </div>
            </form>
        </>
    )
}

TopicForm.defaultProps = {
    topic: { name: "", link: "", image: "", description: "" },
    onSuccess: () => { },
    onClose: () => { }
}

export default TopicForm;