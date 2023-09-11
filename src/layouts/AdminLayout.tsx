import React, { useState } from "react";
import { Link } from "gatsby";
import { useAuth } from "@hooks/Auth";
import Outclick from 'react-outclick-handler';

import { Admin as Redirects } from "../Redirects";

import { AiFillDashboard } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { BsFileEarmarkPost } from "react-icons/bs";
import { FaList, FaPlus, FaUser } from "react-icons/fa";
import { ImBlog } from "react-icons/im";


const Index = ({ children }) => {
    const { user, signOut } = useAuth()

    const [userDropdown, setUserDropdown] = useState<boolean>(false)

    return (
        <Redirects>
            <div className="w-screen h-screen bg-zinc-200 flex flex-col">
                <div className="flex justify-between shadow-lg z-10 bg-white shadow-black/20 p-4">
                    <div className="flex items-center font-bold text-xl gap-2 text-zinc-600"><span><ImBlog /></span><span>My Personal Blog</span></div>
                    <Outclick callback={() => setUserDropdown(false)}>
                        <div onClick={() => setUserDropdown(true)} className="flex items-center gap-3 text-zinc-600 relative">
                            <span className="cursor-pointer text-zinc-700 font-semibold">{user?.username}</span>
                            <span className="cursor-pointer border-l pl-3"><FaUser /></span>
                            {userDropdown &&
                                <div className="text-gray-600 flex flex-col absolute top-full mt-2 shadow-lg right-0">
                                    <button className="bg-white hover:text-gray-800 hover:bg-zinc-100 transition px-4 py-0.5 text-left rounded-t whitespace-nowrap">Alterar conta</button>
                                    <button className="bg-white hover:text-gray-800 hover:bg-zinc-100 transition px-4 py-0.5 rounded-b whitespace-nowrap text-left" onClick={() => signOut()}>Sair</button>
                                </div>
                            }
                        </div>
                    </Outclick>
                </div>
                <div className="flex grow overflow-auto">
                    <div className="w-64 h-full p-4 bg-white">
                        <Link to={"/admin/dashboard"} className="flex items-center gap-2 font-semibold my-4 text-lg text-zinc-700"><AiFillDashboard /> <span>Dashboard</span></Link>

                        <div className="my-4">
                            <h3 className="flex items-center gap-2 text-lg text-zinc-700 font-semibold cursor-pointer"><span><FaUser /></span><span>Usuários</span></h3>
                            <div className="text-zinc-500 mx-3 flex flex-col gap-2 py-3">
                                <Link to={"/admin/users/list"} className="flex items-center gap-2 hover:text-zinc-700 transition"><span><FaList /></span><span>Listar usuários</span></Link>
                            </div>
                        </div>

                        <div className="my-4">
                            <h3 className="flex items-center gap-2 text-lg text-zinc-700 font-semibold cursor-pointer"><span><BiCategoryAlt /></span><span>Tópicos</span></h3>
                            <div className="text-zinc-500 mx-3 flex flex-col gap-2 py-3">
                                <Link to={"/admin/topics/list"} className="flex items-center gap-2 hover:text-zinc-700 transition"><span><FaList /></span><span>Listar tópicos</span></Link>
                            </div>
                        </div>

                        <div className="my-4">
                            <h3 className="flex items-center gap-2 text-lg text-zinc-700 font-semibold cursor-pointer"><span><BsFileEarmarkPost /></span><span>Postagens</span></h3>
                            <div className="text-zinc-500 mx-3 flex flex-col gap-2 py-3">
                                <Link to={"/admin/posts/list"} className="flex items-center gap-2 hover:text-zinc-700 transition"><span><FaList /></span><span>Listar postagens</span></Link>
                                <Link to={"/admin/posts/new-post"} className="flex items-center gap-2 hover:text-zinc-700 transition"><span><FaPlus /></span><span>Criar postagem</span></Link>
                            </div>
                        </div>
                    </div>
                    <div className="grow overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </Redirects>
    )
}

export default Index