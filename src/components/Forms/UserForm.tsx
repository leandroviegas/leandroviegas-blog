import React, { useEffect, useState } from "react"

import { useAuth } from "../../hooks/Auth";
import linkfy from "../../utils/linkfy";
import api from "../../services/api";
import FloatingLabelInput from "./Inputs/FloatingLabelInput";
import Alert from "../Alert";

import { User } from "../../types/blog.type";

import validator from "validator";

import { IoIosClose } from "react-icons/io";
import { VscLoading } from "react-icons/vsc";

type Status = "loading" | "success" | "error" | "input-warnings" | "";

interface UserForm {
    user: User;
    onClose: () => void;
    onSuccess: () => void;
}

const UserForm = ({ user, onClose, onSuccess }) => {
    const { cookies } = useAuth()

    const [status, setStatus] = useState<Status>("")

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({ "user-form": [] })

    const [form, setForm] = useState<User>(user)

    const HandleSaveUser = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        if (status === "loading") return;

        if (["user-form-name", "user-form-link"].some(input => alerts[input]?.length > 0)) {
            setStatus("input-warnings");
        } else {
            setStatus("loading");
            try {
                let headers = { authorization: `Bearer ${cookies.authentication}` }
                console.log(form)
                if (form?._id) {
                    await api.put("/users", form, { headers })
                } else {
                    await api.post("/users", form, { headers })
                }

                onSuccess()
            } catch (err) {
                console.error(err)
                setStatus("error");
                setAlerts({ ...alerts, "user-form": [err?.response?.data?.message || `Ocorreu um erro ao ${form?._id ? "editar" : "adicionar"} tópico!`] })
            }
        }
    }

    useEffect(() => {
        if (!(form.username?.length > 0))
            setAlerts(a => ({ ...a, "user-form-username": [`Nome é obrigatório`] }))
        else if (!(form.username.length > 3))
            setAlerts(a => ({ ...a, "user-form-username": [`Nome deve ter no mínimo 3 caracteres`] }))
        else
            setAlerts(a => ({ ...a, "user-form-username": [] }))

        if (!(form.link?.length > 0))
            setAlerts(a => ({ ...a, "user-form-link": [`Link de usuário é obrigatório`] }))
        else if (!(form.link.length > 3))
            setAlerts(a => ({ ...a, "user-form-link": [`Link de usuário deve ter no mínimo 3 caracteres`] }))
        else if (form.link.endsWith("-"))
            setAlerts(a => ({ ...a, "user-form-link": [`Link de usuário não pode terminar em "-"`] }))
        else
            setAlerts(a => ({ ...a, "user-form-link": [] }))

        if (!(form.email?.length > 0))
            setAlerts(a => ({ ...a, "user-form-email": [`Email é obrigatório`] }))
        else if (!validator.isEmail(form.email))
            setAlerts(a => ({ ...a, "user-form-email": [`Formato de email inválido`] }))
        else
            setAlerts(a => ({ ...a, "user-form-email": [] }))
    }, [form])

    return (
        <>
            <div className="flex gap-2 justify-between items-center rounded-t-lg bg-indigo-600 text-white py-3">
                <h1 className="px-4 text-xl font-bold text-white">{form?._id ? `Editar Usuário - ${form.username}` : "Novo Usuário"}</h1>
                <button onClick={onClose} className="mx-2 hover:opacity-90 transition hover:scale-110">
                    <IoIosClose size={35} />
                </button>
            </div>
            <form onSubmit={HandleSaveUser} className="m-6">
                {alerts["user-form"]?.map(message => <Alert key={message} type="error" message={message} />)}
                <div className="my-5">
                    <FloatingLabelInput label="Nome" name="name" defaultValue={form.username} onChange={evt => setForm({ ...form, username: evt.target.value, link: linkfy(evt.target.value) })} status={(status === "input-warnings" && alerts["user-form-username"]?.length > 0) ? "error" : "info"} messages={alerts["user-form-username"]} />
                </div>
                <div className="my-5">
                    <FloatingLabelInput label="Link de usuário" name="link" value={form.link} onChange={evt => setForm({ ...form, link: linkfy(evt.target.value) })} status={(status === "input-warnings" && alerts["user-form-link"]?.length > 0) ? "error" : "info"} messages={alerts["user-form-link"]} />
                </div>
                <div className="my-5">
                    <FloatingLabelInput label="Email" name="email" value={form.email} onChange={evt => setForm({ ...form, email: evt.target.value })} status={(status === "input-warnings" && alerts["user-form-email"]?.length > 0) ? "error" : "info"} messages={alerts["user-form-email"]} />
                </div>
                <div className="my-5">
                    <FloatingLabelInput label="Sobre" name="about" type="textarea" value={form.about} onChange={evt => setForm({ ...form, about: evt.currentTarget.value })} status={(status === "input-warnings" && alerts["user-form-about"]?.length > 0) ? "error" : "info"} messages={alerts["user-form-about"]} />
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

UserForm.defaultProps = {
    user: { name: "", link: "", profilePicture: "", about: "" },
    onSuccess: () => { },
    onClose: () => { }
}

export default UserForm;