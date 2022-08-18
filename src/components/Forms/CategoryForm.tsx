import React, { useEffect, useState } from "react"

import { useAuth } from "../../hooks/Auth";
import linkfy from "../../utils/linkfy";
import api from "../../services/api";
import FloatingLabelInput from "./Inputs/FloatingLabelInput";
import Alert from "../Alert";

import { Category } from "../../types/blog.type";

import { IoIosClose } from "react-icons/io";
import { VscLoading } from "react-icons/vsc";

type Status = "loading" | "success" | "error" | "input-warnings" | "";

interface CategoryForm {
    category: Category;
    onClose: () => void;
    onSuccess: () => void;
}

const CategoryForm = ({ category, onClose, onSuccess }) => {
    const { cookies } = useAuth()

    const [status, setStatus] = useState<Status>("")

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({ "category-form": [] })

    const [form, setForm] = useState<Category>(category)

    const HandleSaveCategory = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        if (status === "loading") return;

        if (["category-form-name", "category-form-link"].some(input => alerts[input].length > 0)) {
            setStatus("input-warnings");
        } else {
            setStatus("loading");
            try {
                let headers = { authorization: `Bearer ${cookies.authentication}` }
                console.log(form)
                if (form?._id) {
                    await api.put("/categories", form, { headers })
                } else {
                    await api.post("/categories", form, { headers })
                }

                onSuccess()
            } catch (err) {
                console.error(err)
                setStatus("error");
                setAlerts({ ...alerts, "category-form": [err?.response?.data?.message || `Ocorreu um erro ao ${form?._id ? "editar" : "adicionar"} categoria!`] })
            }
        }
    }

    useEffect(() => {
        if (!(form.name.length > 0))
            setAlerts(a => ({ ...a, "category-form-name": [`Nome é obrigatório`] }))
        else if (!(form.name.length > 3))
            setAlerts(a => ({ ...a, "category-form-name": [`Nome deve ter no mínimo 3 caracteres`] }))
        else
            setAlerts(a => ({ ...a, "category-form-name": [] }))

        if (!(form.link.length > 0))
            setAlerts(a => ({ ...a, "category-form-link": [`Link é obrigatório`] }))
        else if (!(form.link.length > 3))
            setAlerts(a => ({ ...a, "category-form-link": [`Link deve ter no mínimo 3 caracteres`] }))
        else if (form.link.endsWith("-"))
            setAlerts(a => ({ ...a, "category-form-link": [`Link não pode terminar em "-"`] }))
        else
            setAlerts(a => ({ ...a, "category-form-link": [] }))
    }, [form])

    return (
        <>
            <div className="flex gap-2 justify-between items-center rounded-t-lg bg-violet-700 text-white py-3">
                <h1 className="px-4 text-xl font-bold text-white">{form?._id ? `Editar categoria - ${form.name}` : "Nova categoria"}</h1>
                <button onClick={onClose} className="mx-2 hover:opacity-90 transition hover:scale-110">
                    <IoIosClose size={35} />
                </button>
            </div>
            <form onSubmit={HandleSaveCategory} className="m-6">
                {alerts["category-form"]?.map(message => <Alert key={message} type="error" message={message} />)}
                <div className="my-5">
                    <FloatingLabelInput label="Nome" name="name" defaultValue={form.name} onChange={evt => setForm({ ...form, name: evt.target.value, link: linkfy(evt.target.value) })} status={(status === "input-warnings" && alerts["category-form-name"].length > 0) ? "error" : "info"} messages={alerts["category-form-name"]} />
                </div>
                <div className="my-5">
                    <FloatingLabelInput label="Nome" name="link" value={form.link} onChange={evt => setForm({ ...form, link: linkfy(evt.target.value) })} status={(status === "input-warnings" && alerts["category-form-link"].length > 0) ? "error" : "info"} messages={alerts["category-form-link"]} />
                </div>
                <div className="my-5">
                    <FloatingLabelInput label="Descrição" name="description" type="textarea" value={form.description} onChange={evt => setForm({ ...form, description: evt.currentTarget.value })} status={(status === "input-warnings" && alerts["category-form-description"].length > 0) ? "error" : "info"} messages={alerts["category-form-description"]} />
                </div>
                <hr className="my-4" />
                <div className="flex items-center justify-between gap-6 flex-wrap">
                    <button type="submit" className="bg-violet-700 hover:bg-violet-800 shadow-lg shadow-violet-700/30 rounded-xl text-white py-2 px-4 hover:scale-105 transition font-semibold">
                        {status === "loading" ? <VscLoading className="animate-spin text-lg mx-6 my-0.5" /> : form?._id ? `Salvar informações` : "Adicionar categoria"}
                    </button>
                    <button type="button" onClick={onClose} className="py-2 transition px-4 text-zinc-800 bg-zinc-200 hover:bg-zinc-300 font-semibold rounded-lg">Cancelar</button>
                </div>
            </form>
        </>
    )
}

CategoryForm.defaultProps = {
    category: { name: "", link: "", image: "", description: "" },
    onSuccess: () => { },
    onClose: () => { }
}

export default CategoryForm;