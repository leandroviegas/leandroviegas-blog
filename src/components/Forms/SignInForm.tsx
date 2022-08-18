import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/Auth";

import Alert from "../Alert";
import FloatingLabelInput from "./Inputs/FloatingLabelInput";

import { VscLoading } from "react-icons/vsc";

const SignInForm = ({ onSuccess }) => {
    const { signIn } = useAuth()

    const [status, setStatus] = useState<"error" | "loading" | "success" | "input-warnings" | "">("")

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const [form, setForm] = useState<{ usernameOrEmail: string, password: string }>({ usernameOrEmail: "", password: "" })

    const HandleSignIn = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        if (status === "loading") return;

        if (["username-or-email-error", "password-error"].some(errors => alerts[errors]?.length > 0)) {
            setStatus("input-warnings")
        } else {
            setStatus("loading")
            signIn(form.usernameOrEmail, form.password)
                .then(() => {
                    setStatus("success")
                    onSuccess()
                }).catch(err => {
                    console.error(err)
                    setStatus("error")
                    setAlerts({ ...alerts, "signin-error": [err.response?.data?.message || "Erro ao fazer login"] })
                })
        }
    }

    useEffect(() => {
        if (!(form.usernameOrEmail.length > 0))
            setAlerts(a => ({ ...a, "username-or-email-error": ["O campo de usuário ou e-mail é obrigatório"] }))
        else if (!(form.usernameOrEmail.length > 3))
            setAlerts(a => ({ ...a, "username-or-email-error": ["O campo de usuário ou e-mail deve ter mais de 3 caracteres"] }))
        else
            setAlerts(a => ({ ...a, "username-or-email-error": [] }))


        if (!(form.password.length > 0))
            setAlerts(a => ({ ...a, "password-error": ["O campo de senha é obrigatório"] }))
        else if (!(form.password.length >= 8))
            setAlerts(a => ({ ...a, "password-error": ["O campo de senha deve ter mais de 8 caracteres"] }))
        else
            setAlerts(a => ({ ...a, "password-error": [] }))

    }, [form])

    return (
        <form onSubmit={HandleSignIn} className="flex flex-col gap-3">
            <div>
                {alerts["signin-error"]?.map(message => <Alert key={message} type="error" message={message} />)}
            </div>
            <div className="my-2">
                <FloatingLabelInput label="Email ou usuário" status={(status === "input-warnings" && alerts["username-or-email-error"]?.length > 0) ? "error" : "info"} messages={alerts["username-or-email-error"]} defaultValue="" onChange={evt => setForm({ ...form, usernameOrEmail: evt.target.value })} />
            </div>
            <div className="my-2">
                <FloatingLabelInput label="Senha" type="password" status={(status === "input-warnings" && alerts["password-error"]?.length > 0) ? "error" : "info"} messages={alerts["password-error"]} defaultValue="" onChange={evt => setForm({ ...form, password: evt.target.value })} />
            </div>
            <hr className="py-1" />
            <div className="w-full">
                <button type="submit" className="from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 rounded text-lg font-semibold w-full bg-gradient-to-b from-purple-700 to-indigo-600 hover:text-white text-zinc-50 px-3 py-2 hover:bg-purple-800 transition">
                    {status === "loading" ? <VscLoading className="animate-spin mx-auto text-2xl" /> : "Entrar"}
                </button>
            </div>
        </form>
    )
}

export default SignInForm;