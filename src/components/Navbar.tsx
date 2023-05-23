import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { useLocation } from '@reach/router';

import { FaAngleDown, FaAngleUp, FaSearch } from "react-icons/fa"
import { TiCode } from "react-icons/ti"
import { MdClose } from "react-icons/md"
import { BiMenu } from "react-icons/bi"
import { AiOutlineHome, AiOutlineRead } from "react-icons/ai"

import Outclick from 'react-outclick-handler'

import { useAuth } from "../hooks/Auth"
import SignPopup from "./Popups/SignPopup"
import { BsPerson } from "react-icons/bs";

const Index = () => {
    const location = useLocation();

    const { signOut, user } = useAuth();

    const [showNavbar, setShowNavbar] = useState<boolean>(false);

    const [userDropdown, setUserDropdown] = useState<boolean>(false);

    const [signOpen, setSignOpen] = useState<boolean>(false);

    const [tab, setTab] = React.useState<"SignUp" | "SignIn">("SignUp");

    useEffect(() => {
        document.body.style.overflowY = (signOpen || showNavbar) ? "hidden" : "auto";
    }, [signOpen, showNavbar])

    return (
        <>
            <SignPopup open={signOpen} setOpen={setSignOpen} setTab={setTab} tab={tab} />
            <nav className=" w-full max-w-screen">
                <div className="container mx-auto flex flex-row justify-between lg:items-center py-6">
                    <div className="shrink-0 grow flex flex-col md:flex-row justify-start items-center gap-4 px-2">
                        <Link to={"/"} className="flex items-center gap-1">
                            <span className="text-4xl text-zinc-800 shrink-0"><TiCode /></span>
                            <span className="text-2xl font-bold text-zinc-600 shrink-0">Leandro Viegas</span>
                        </Link>
                        {location.pathname.startsWith("/blog") &&
                            <form className="border-b border-black mx-3 pb-1 md:w-auto flex items-center text-sm">
                                <button className="px-1 text-zinc-800 h-full text-center"><FaSearch /></button>
                                <input className="grow w-full ml-2 text-zinc-800 placeholder:text-black/60 h-full rounded-r bg-transparent outline-none" placeholder="Procurar" type="text" />
                            </form>}
                    </div>

                    <div className={`${showNavbar ? "" : "hidden"} lg:block w-screen h-screen lg:w-auto lg:h-auto fixed lg:relative right-0 top-0 z-20 flex justify-end backdrop-blur-sm bg-black/70 lg:bg-transparent`}>
                        <Outclick callback={() => setShowNavbar(false)}>
                            <div className={`${showNavbar ? "max-w-64 " : "max-w-0 "}w-full navbar lg:max-w-none lg:block duration-300 h-full bg-white lg:bg-transparent overflow-auto lg:max-w-auto`}>
                                <div className="p-4 lg:p-0 justify-start flex flex-col lg:flex-row lg:items-center gap-4 font-medium">
                                    <Link to="/" className={`order-1 bg-white px-4 py-1 rounded ${location.pathname === "/" ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-600"} flex items-center gap-1`}><AiOutlineHome /> Página Inicial</Link>
                                    <Link to="/about" className={`order-1 bg-white px-4 py-1 rounded ${location.pathname.startsWith("/about") ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-600"} flex items-center gap-1`}> <BsPerson /> Sobre</Link>
                                    <Link to="/blog" className={`order-1 bg-white px-4 py-1 rounded ${location.pathname.startsWith("/blog") ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-600"} flex items-center gap-1`}> <AiOutlineRead /> Blog</Link>
                                    <div className="order-0 lg:order-1">
                                        <button className="lg:hidden w-full flex justify-end">
                                            <MdClose onClick={() => setShowNavbar(false)} className="text-zinc-500 hover:text-zinc-700 text-4xl cursor-pointer" />
                                        </button>
                                        {user?.username ?
                                            <div>
                                                <Outclick callback={() => setUserDropdown(false)}>
                                                    <button onClick={() => setUserDropdown(!userDropdown)} className={`flex items-center gap-1 text-zinc-700 hover:text-zinc-900`}>
                                                        <span>{user.username}</span>
                                                        {!userDropdown && <span><FaAngleDown /></span>}
                                                        {userDropdown && <span><FaAngleUp /></span>}
                                                    </button>
                                                    <div className={`${userDropdown ? "max-h-auto dropdown-animate" : "max-h-0"} border-l lg:border-none overflow-y-auto lg:absolute mt-4 right-0 flex flex-col text-zinc-300 lg:text-zinc-700 text-left`}>
                                                        <button onClick={signOut} className="lg:bg-white hover:text-zinc-100 text-left w-full px-3 py-1 lg:py-0.5 rounded-t lg:hover:text-zinc-900 cursor-pointer">Sair</button>
                                                        <Link to={"/admin/dashboard"} className="lg:bg-white hover:text-zinc-100 w-full px-3 py-1 lg:py-0.5 rounded-b lg:hover:text-zinc-900 cursor-pointer">Área administrativa</Link>
                                                    </div>
                                                </Outclick>
                                            </div>
                                            :
                                            <div className="flex gap-4 text-sm font-semibold">
                                                <button onClick={() => { setTab("SignIn"); setSignOpen(true); }} className="shrink-0 text-white bg-violet-700 hover:bg-violet-800 rounded py-1 px-4">Entrar</button>
                                                <button onClick={() => { setTab("SignUp"); setSignOpen(true); }} className="shrink-0 text-white bg-violet-700 hover:bg-violet-800 rounded py-1 px-4">Registrar-se</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Outclick>

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