import React, { useState } from "react";
import { Link } from "gatsby";

import { useAuth } from "@hooks/useAuth";
import { useTheme } from "@hooks/useTheme";

import Outclick from 'outclick-react';

import { Admin as Redirects } from "../Redirects";

import { AiFillDashboard } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { BsFileEarmarkPost, BsMoon, BsSun } from "react-icons/bs";
import { FaList, FaPlus, FaUser } from "react-icons/fa";
import { ImBlog } from "react-icons/im";


const Index = ({ children }) => {
    const { user, signOut } = useAuth()

    const [userDropdown, setUserDropdown] = useState<boolean>(false)

    const { theme, SwitchTheme } = useTheme();

    return (
        <Redirects>
            <div className="w-screen h-screen bg-zinc-200 dark:bg-zinc-700 flex flex-col">
                <div className="flex justify-between shadow-lg z-10 bg-white dark:bg-zinc-900 shadow-black/20 p-4">
                    <Link to="/" className="flex items-center font-bold text-xl gap-2 text-zinc-600 dark:text-zinc-300"><span><ImBlog /></span><span>Leandro Viegas</span></Link>
                    <button className="border border-zinc-500 rounded-full p-1" onClick={SwitchTheme}>
                        {theme === 'light' ?
                            <BsMoon className="text-zinc-600 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-50 text-lg cursor-pointer" /> :
                            <BsSun className="text-zinc-600 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-50 text-lg cursor-pointer" />}
                    </button>
                    <Outclick onOutClick={() => setUserDropdown(false)}>
                        <div onClick={() => setUserDropdown(true)} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 relative">
                            <span className="cursor-pointer text-zinc-700 dark:text-zinc-200 font-semibold">{user?.username}</span>
                            <span className="cursor-pointer border-l pl-3"><FaUser /></span>
                            {userDropdown &&
                                <div className="text-gray-600 dark:text-zinc-300 flex flex-col absolute top-full mt-2 shadow-lg right-0">
                                    <Link to={"/dashboard/customize-profile"} className="bg-white hover:text-gray-800 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:text-gray-100 dark:hover:bg-zinc-800 transition px-4 py-0.5 text-left rounded-t whitespace-nowrap">Customizar perfil</Link>
                                    <button className="bg-white hover:text-gray-800 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:text-gray-100 dark:hover:bg-zinc-800 transition px-4 py-0.5 rounded-b whitespace-nowrap text-left" onClick={() => signOut()}>Sair</button>
                                </div>}
                        </div>
                    </Outclick>
                </div>
                <div className="flex grow overflow-auto">
                    {
                        ["admin", "writer"].includes(user?.role) &&
                        <div className="w-64 h-full p-4 bg-white dark:bg-zinc-900">
                            <Link to={"/dashboard"} className="flex items-center gap-2 font-semibold my-4 text-lg text-zinc-700 dark:text-zinc-100"><AiFillDashboard /> <span>Dashboard</span></Link>

                            <div className="my-4">
                                <h3 className="flex items-center gap-2 text-lg text-zinc-700 dark:text-zinc-100 font-semibold cursor-pointer"><span><FaUser /></span><span>Usuários</span></h3>
                                <div className="text-zinc-500 dark:text-zinc-300 mx-3 flex flex-col gap-2 py-3">
                                    <Link to={"/dashboard/users/list"} className="flex items-center gap-2 hover:text-zinc-700 dark:hover:text-zinc-200 transition"><span><FaList /></span><span>Listar usuários</span></Link>
                                </div>
                            </div>

                            <div className="my-4">
                                <h3 className="flex items-center gap-2 text-lg text-zinc-700 dark:text-zinc-100 font-semibold cursor-pointer"><span><BiCategoryAlt /></span><span>Tópicos</span></h3>
                                <div className="text-zinc-500 dark:text-zinc-300 mx-3 flex flex-col gap-2 py-3">
                                    <Link to={"/dashboard/topics/list"} className="flex items-center gap-2 hover:text-zinc-700 dark:hover:text-zinc-200 transition"><span><FaList /></span><span>Listar tópicos</span></Link>
                                </div>
                            </div>

                            <div className="my-4">
                                <h3 className="flex items-center gap-2 text-lg text-zinc-700 dark:text-zinc-100 font-semibold cursor-pointer"><span><BsFileEarmarkPost /></span><span>Postagens</span></h3>
                                <div className="text-zinc-500 dark:text-zinc-300 mx-3 flex flex-col gap-2 py-3">
                                    <Link to={"/dashboard/posts/list"} className="flex items-center gap-2 hover:text-zinc-700 dark:hover:text-zinc-200 transition"><span><FaList /></span><span>Listar postagens</span></Link>
                                    <Link to={"/dashboard/posts/new-post"} className="flex items-center gap-2 hover:text-zinc-700 dark:hover:text-zinc-200 transition"><span><FaPlus /></span><span>Criar postagem</span></Link>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="grow overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </Redirects>
    )
}

export default Index