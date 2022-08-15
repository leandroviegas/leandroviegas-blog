import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { useLocation } from '@reach/router';

import { FaAngleDown, FaAngleUp, FaSearch } from "react-icons/fa"
import { TiCode } from "react-icons/ti"
import { MdClose } from "react-icons/md"
import { BiMenu } from "react-icons/bi"
import { VscLoading } from "react-icons/vsc"

import Outclick from "./outclick"
import Alert, { AlertProps } from "./Alert"

import { useAuth } from "../hooks/Auth"

import validator from "validator"

const Index = () => {
    const location = useLocation();

    const [showNavbar, setShowNavbar] = useState<boolean>(false)

    const [userDropdown, setUserDropdown] = useState<boolean>(false)

    const [tab, setTab] = useState<"SignUp" | "SignIn" | "">("")

    const { signIn, signUp, signOut, user } = useAuth()

    const [alerts, setAlerts] = useState<(AlertProps & { input: string })[]>([])

    const [loginFormState, setLoginFormState] = useState<"error" | "loading" | "success">()
    const [loginForm, setLoginForm] = useState<{ usernameOrEmail: string, password: string }>({ usernameOrEmail: "", password: "" })

    const HandleLogin = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()

        if (loginFormState === "loading") return;
        setAlerts([])

        let alerts: (AlertProps & { input: string })[] = []

        if (!(loginForm.usernameOrEmail.length > 3)) alerts.push({
            input: "login-usernameOrEmail",
            message: "Nome ou email precisa ter ao menos 4 caracteres.",
            type: "warning"
        })

        if (!(loginForm.password.length >= 8)) alerts.push({
            input: "login-password",
            message: "Senha precisa ter ao menos 8 caracteres.",
            type: "warning"
        })

        setAlerts(alerts)

        if (alerts.length === 0) {
            setLoginFormState("loading")

            signIn(loginForm.usernameOrEmail, loginForm.password)
                .then(() => {
                    setLoginFormState("success")
                    setTab("")
                }).catch(err => {
                    setLoginFormState("error")
                    if (err.response.data?.message)
                        setAlerts([{ type: "error", message: err.response.data.message, input: "login" }])
                    else
                        setAlerts([{ type: "error", message: "Ocorreu um erro ao tentar entrar!", input: "login" }])
                })
        }
    }

    const [registerFormState, setRegisterFormState] = useState<"error" | "loading" | "success">()
    const [registerForm, setRegisterForm] = useState<{ username: string, email: string, password: string }>({ username: "", email: "", password: "" })

    const HandleRegister = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()

        if (registerFormState === "loading") return;
        setAlerts([])

        let alerts: (AlertProps & { input: string })[] = []

        if (!(registerForm.username.length > 3)) alerts.push({
            input: "register-username",
            message: "Nome precisa ter ao menos 4 caracteres.",
            type: "warning"
        })

        if (!validator.isEmail(registerForm.email)) alerts.push({
            input: "register-email",
            message: "Formato de email invalido.",
            type: "warning"
        })

        if (!validator.isStrongPassword(registerForm.password)) alerts.push({
            input: "register-password",
            message: "Essa enha está fraca.",
            type: "warning"
        })

        setAlerts(alerts)

        if (alerts.length === 0) {
            setRegisterFormState("loading")

            signUp(registerForm.username, registerForm.email, registerForm.password)
                .then(() => {
                    setRegisterFormState("success")
                    setTab("")
                }).catch(err => {
                    setRegisterFormState("error")
                    if (err.response.data?.message)
                        setAlerts([{ type: "error", message: err.response.data.message, input: "register" }])
                    else
                        setAlerts([{ type: "error", message: "Ocorreu um erro ao tentar se cadastrar!", input: "register" }])
                })
        }
    }

    useEffect(() => {
        setAlerts([])
        setLoginForm({ usernameOrEmail: "", password: "" })
        setRegisterForm({ username: "", email: "", password: "" })
        document.body.style.overflowY = (tab !== "" || showNavbar) ? "hidden" : "auto";
    }, [tab, showNavbar])

    return (
        <>
            {tab !== "" &&
                <div className="fixed h-screen w-screen top-0 left-0 bg-black/50 z-30 flex items-center justify-center">
                    <Outclick callback={() => setTab("")}>
                        <div data-aos="fade-down" className="bg-white rounded-lg max-w-screen w-96 shadow">

                            <div className="p-8 text-zinc-700 rounded-t-lg">
                                {tab === "SignIn" &&
                                    <>
                                        <div className="grid grid-cols-2 border rounded">
                                            <button className={`font-semibold w-full bg-gradient-to-b from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white py-1 rounded`}>Entrar</button>
                                            <button onClick={() => setTab("SignUp")} className={`font-semibold w-full text-zinc-600 hover:text-zinc-900 transition py-1 rounded`}>Registrar-se</button>
                                        </div>
                                        <div className="flex justify-center items-center py-8 pb-5">
                                            <span className="absolute text-sm bg-white px-2 text-zinc-500">Redes sociais</span>
                                            <hr className="w-full" />
                                        </div>

                                        <div className="w-full flex justify-center py-3">
                                            <button className="bg-red-500 font-semibold text-white transition px-3 py-1 hover:bg-red-600">Entrar com Google</button>
                                        </div>

                                        <div className="flex justify-center items-center py-3">
                                            <span className="absolute text-sm bg-white px-2 text-zinc-500">ou</span>
                                            <hr className="w-full" />
                                        </div>

                                        <form onSubmit={HandleLogin} className="flex flex-col gap-3 mt-4">
                                            <div>
                                                {alerts.filter(alert => alert.input === "login").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                            </div>
                                            <div>
                                                <input type="text" onChange={evt => setLoginForm({ ...loginForm, usernameOrEmail: evt.currentTarget.value })} className="my-1 w-full border rounded px-2 py-1 outline-none text-zinc-700" placeholder="Digite seu nome de usuário ou email" />
                                                {alerts.filter(alert => alert.input === "login-usernameOrEmail").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                            </div>
                                            <div>
                                                <input type="password" onChange={evt => setLoginForm({ ...loginForm, password: evt.currentTarget.value })} className="my-1 w-full border rounded px-2 py-1 outline-none text-zinc-700" placeholder="Digite sua senha" />
                                                {alerts.filter(alert => alert.input === "login-password").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                            </div>
                                            <hr className="py-1" />
                                            <div className="w-full">
                                                <button type="submit" className="from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 rounded text-lg font-semibold w-full bg-gradient-to-b from-purple-700 to-indigo-600 hover:text-white text-zinc-50 px-3 py-1 hover:bg-purple-800 transition">{loginFormState === "loading" ? <VscLoading className="animate-spin mx-auto text-2xl" /> : "Entrar"}</button>
                                            </div>
                                        </form>
                                    </>
                                }
                                {tab === "SignUp" &&
                                    <>
                                        <div className="grid grid-cols-2 border rounded">
                                            <button onClick={() => setTab("SignIn")} className={`font-semibold w-full text-zinc-600 hover:text-zinc-900 transition py-1 rounded`}>Entrar</button>
                                            <button className={`font-semibold w-full bg-gradient-to-b from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white py-1 rounded`}>Registrar-se</button>
                                        </div>
                                        <div className="flex justify-center items-center py-8 pb-5">
                                            <span className="absolute text-sm bg-white px-2 text-zinc-500">Redes sociais</span>
                                            <hr className="w-full" />
                                        </div>

                                        <div className="w-full flex justify-center py-3">
                                            <button className="bg-red-500 font-semibold text-white transition px-3 py-1 hover:bg-red-600">Registrar-se com Google</button>
                                        </div>

                                        <div className="flex justify-center items-center py-3">
                                            <span className="absolute text-sm bg-white px-2 text-zinc-500">ou</span>
                                            <hr className="w-full" />
                                        </div>

                                        <form onSubmit={HandleRegister} className="flex flex-col gap-3 mt-4">
                                            <div>
                                                {alerts.filter(alert => alert.input === "register").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                            </div>
                                            <div>
                                                <input type="text" onChange={evt => setRegisterForm({ ...registerForm, username: evt.currentTarget.value })} className="my-1 w-full border rounded px-2 py-1 outline-none text-zinc-700" placeholder="Digite seu nome de usuário" />
                                                {alerts.filter(alert => alert.input === "register-username").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                            </div>
                                            <div>
                                                <input type="email" onChange={evt => setRegisterForm({ ...registerForm, email: evt.currentTarget.value })} className="my-1 w-full border rounded px-2 py-1 outline-none text-zinc-700" placeholder="Digite seu email" />
                                                {alerts.filter(alert => alert.input === "register-email").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                            </div>
                                            <div>
                                                <input type="password" onChange={evt => setRegisterForm({ ...registerForm, password: evt.currentTarget.value })} className="my-1 w-full border rounded px-2 py-1 outline-none text-zinc-700" placeholder="Digite sua senha" />
                                                {alerts.filter(alert => alert.input === "register-password").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                            </div>
                                            <hr className="py-1" />
                                            <div className="w-full">
                                                <button type="submit" className="from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 rounded text-lg font-semibold w-full bg-gradient-to-b from-purple-700 to-indigo-600 hover:text-white text-zinc-50 px-3 py-1 hover:bg-purple-800 transition">{registerFormState === "loading" ? <VscLoading className="animate-spin mx-auto text-2xl" /> : "Registrar-se"}</button>
                                            </div>
                                        </form>
                                    </>
                                }
                            </div>

                        </div>
                    </Outclick>
                </div>
            }
            <nav className="bg-gradient-to-b from-purple-600 to-indigo-500 w-full max-w-screen">
                <div className="container mx-auto flex flex-row justify-between lg:items-center py-4">
                    <div className="shrink-0 grow flex flex-col md:flex-row justify-start items-center gap-4 px-2">
                        <Link to={"/"} className="flex items-center gap-1">
                            <span className="text-4xl text-zinc-800 shrink-0"><TiCode /></span>
                            <span className="font-semibold text-zinc-800 shrink-0">Leandro Viegas</span>
                        </Link>
                        {location.pathname.startsWith("/blog") &&
                            <form className="border-b border-black mx-3 pb-1 md:w-auto flex items-center text-sm">
                                <button className="px-1 text-zinc-800 h-full text-center"><FaSearch /></button>
                                <input className="grow w-full ml-2 text-zinc-800 placeholder:text-black/60 h-full rounded-r bg-transparent outline-none" placeholder="Procurar" type="text" />
                            </form>}
                    </div>

                    <div className={`${showNavbar ? "" : "hidden "} lg:block w-screen h-screen lg:w-auto lg:h-auto fixed lg:relative right-0 top-0 z-20 flex justify-end bg-black/70 lg:bg-transparent`}>
                        <div className={`${showNavbar ? "max-w-64 " : "max-w-0 "}w-full navbar lg:max-w-none lg:block duration-300 h-full bg-white lg:bg-transparent overflow-auto lg:max-w-auto text-gray-800 font-semibold`}>
                            <div className="p-4 lg:p-0 justify-start flex flex-col lg:flex-row lg:items-center gap-4">
                                {[
                                    { value: "Página Inicial", href: "/", openedPage: location.pathname === "/" },
                                    { value: "Blog", href: "/blog" }
                                ].map(link => <Link to={link.href} key={link.value + link.href} className={`order-1 ${(link.openedPage ?? location.pathname.startsWith(link.href)) ? "text-black lg:text-white hover:lg:text-white" : "text-zinc-800 hover:text-black hover:lg:text-white/90"}`}>{link.value}</Link>)}
                                <div className="order-0 lg:order-1">
                                    <button className="lg:hidden w-full mb-4 flex justify-end">
                                        <MdClose onClick={() => setShowNavbar(false)} className="text-zinc-600 hover:text-black text-4xl cursor-pointer" />
                                    </button>
                                    {user?.username ?
                                        <div>
                                            <Outclick callback={() => setUserDropdown(false)}>
                                                <button onClick={() => setUserDropdown(!userDropdown)} className="flex items-center gap-1">
                                                    <span>{user.username}</span>
                                                    {!userDropdown && <span><FaAngleDown /></span>}
                                                    {userDropdown && <span><FaAngleUp /></span>}
                                                </button>
                                                <div className={`${userDropdown ? "max-h-auto dropdown-animate" : "max-h-0"} overflow-y-auto lg:absolute mt-1 right-0 flex flex-col text-zinc-700 text-left`}>
                                                    <button onClick={signOut} className="bg-white text-left w-full px-3 py-1 lg:py-0.5 rounded-t hover:text-zinc-900 cursor-pointer">Sair</button>
                                                    <Link to={"/admin/dashboard"} className="bg-white w-full px-3 py-1 lg:py-0.5 rounded-b hover:text-zinc-900 cursor-pointer">Área administrativa</Link>
                                                </div>
                                            </Outclick>
                                        </div>
                                        :
                                        <div className="flex gap-4 text-sm">
                                            <button onClick={() => setTab("SignIn")} className="shrink-0 bg-gradient-to-b from-indigo-600 to-purple-400 lg:from-white lg:to-white hover:text-black text-gray-800 rounded py-1 px-4">Entrar</button>
                                            <button onClick={() => setTab("SignUp")} className="shrink-0 bg-gradient-to-b from-indigo-600 to-purple-400 lg:from-white lg:to-white hover:text-black text-gray-800 rounded py-1 px-4">Registrar-se</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="absolute top-0 right-0 text-3xl p-4 lg:hidden">
                    <BiMenu onClick={() => setShowNavbar(true)} />
                </button>
            </nav>

        </>
    )
}

export default Index