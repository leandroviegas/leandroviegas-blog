import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/Auth";

import Alert from "../../../Alert";
import FloatingLabelInput from "../../../Inputs/FloatingLabelInput";
import validator from "validator";

import { VscLoading } from "react-icons/vsc";

const SignInForm = ({ onSuccess }) => {
    const { signUp } = useAuth()

    const [status, setStatus] = useState<"error" | "loading" | "success" | "input-warnings" | "">("")

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const [form, setForm] = useState<{ email: string, username: string, password: string, passwordValidation: string }>({ email: "", username: "", password: "", passwordValidation: "" })

    const HandleSignUp = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        if (status === "loading") return;

        if (["username-error", "email-error", "password-error"].some(errors => alerts[errors]?.length > 0)) {
            setStatus("input-warnings")
        } else {
            setStatus("loading")
            signUp(form.username, form.email, form.password)
                .then(() => {
                    setStatus("success")
                    onSuccess()
                }).catch(err => {
                    console.error(err)
                    setStatus("error")
                    setAlerts({ ...alerts, "signup-error": [err.response.data?.message || "Erro ao se registrar"] })
                })
        }
    }

    useEffect(() => {
        if (!(form.username.length > 0))
            setAlerts(a => ({ ...a, "username-error": ["Nome é obrigatório"] }))
        else if (!(form.username.length > 3))
            setAlerts(a => ({ ...a, "username-error": ["Nome precisa ter ao menos 4 caracteres"] }))
        else
            setAlerts(a => ({ ...a, "username-error": [] }))

        if (!(form.email.length > 0))
            setAlerts(a => ({ ...a, "email-error": ["Email é obrigatório"] }))
        else if (!validator.isEmail(form.email))
            setAlerts(a => ({ ...a, "email-error": ["Formato de email inválido"] }))
        else
            setAlerts(a => ({ ...a, "email-error": [] }))

        if (!(form.password.length > 0))
            setAlerts(a => ({ ...a, "password-error": ["Senha é obrigatória"] }))
        else if (form.password.length < 8)
            setAlerts(a => ({ ...a, "password-error": ["Senha precisar ter 8 caracteres ou mais"] }))
        else if (!form.password.match(/[A-Z]/))
            setAlerts(a => ({ ...a, "password-error": ["Senha precisar ter letras em maisculo"] }))
        else if (!form.password.match(/[^a-zA-Z\d]/))
            setAlerts(a => ({ ...a, "password-error": ["Senha precisar ter caracteres especiais"] }))
        else
            setAlerts(a => ({ ...a, "password-error": [] }))

        if (form.password !== form.passwordValidation)
            setAlerts(a => ({ ...a, "passwordValidation-error": ["Senhas não são iguais"] }))
        else
            setAlerts(a => ({ ...a, "passwordValidation-error": [] }))
    }, [form])

    return (
        <form onSubmit={HandleSignUp} className="flex flex-col gap-3">
            <div>
                {alerts["signup-error"]?.map(message => <Alert key={message} type="error" message={message} />)}
            </div>
            <div className="my-2">
                <FloatingLabelInput label="Usuário" status={(status === "input-warnings" && alerts["username-error"]?.length > 0) ? "error" : "info"} messages={alerts["username-error"]} defaultValue="" onChange={evt => setForm({ ...form, username: evt.target.value })} />
            </div>
            <div className="my-2">
                <FloatingLabelInput label="Email" status={(status === "input-warnings" && alerts["email-error"]?.length > 0) ? "error" : "info"} messages={alerts["email-error"]} defaultValue="" onChange={evt => setForm({ ...form, email: evt.target.value })} />
            </div>
            <div className="my-2">
                <FloatingLabelInput label="Senha" status={(status === "input-warnings" && alerts["password-error"]?.length > 0) ? "error" : "info"} messages={alerts["password-error"]} defaultValue="" onChange={evt => setForm({ ...form, password: evt.target.value })} type="password" />
            </div>
            <div className="my-2">
                <FloatingLabelInput label="Validar senha" status={(status === "input-warnings" && alerts["passwordValidation-error"]?.length > 0) ? "error" : "info"} messages={alerts["passwordValidation-error"]} defaultValue="" onChange={evt => setForm({ ...form, passwordValidation: evt.target.value })} type="password" />
            </div>
            <hr className="py-1" />
            <div className="w-full">
                <button type="submit" className="bg-violet-600 hover:bg-violet-800 hover:text-white text-zinc-200 rounded text-lg font-semibold w-full px-3 py-2 transition">
                    {status === "loading" ? <VscLoading className="animate-spin mx-auto text-2xl" /> : "Registrar-se"}
                </button>
            </div>
        </form>
    )
}

export default SignInForm;