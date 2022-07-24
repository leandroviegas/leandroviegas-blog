import { Link } from "react-router-dom";

import { AiFillDashboard } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { BsFileEarmarkPost } from "react-icons/bs";
import { FaList, FaPlus, FaUser } from "react-icons/fa";
import { ImBlog } from "react-icons/im";
import { useAuth } from "../Hooks/Auth";

type AdminLayoutProps = {
    children: any;
}

const Index = ({ children }: AdminLayoutProps) => {

    const { userInfo } = useAuth()

    return (
        <>
            <div className="w-screen h-screen bg-zinc-100 flex">
                <div className="w-64 h-full bg-sky-600 p-4">
                    <div className="flex items-center font-bold text-xl gap-2 text-white mt-3"><span><ImBlog /></span><span>My blog</span></div>

                    <hr className="my-5" />

                    <Link to={"/admin/dashboard"} className="flex items-center gap-2 font-semibold my-4 text-lg text-sky-100"><AiFillDashboard /> <span>Dashboard</span></Link>

                    <div className="my-4">
                        <h3 className="flex items-center gap-2 text-lg text-sky-100 font-semibold cursor-pointer"><span><BiCategoryAlt /></span><span>Categorias</span></h3>
                        <div className="text-sky-200 mx-3 flex flex-col gap-2 py-3">
                            <Link to={"/admin/categorias/listar"} className="flex items-center gap-2 hover:text-sky-100 transition"><span><FaList /></span><span>Listar</span></Link>
                        </div>
                    </div>

                    <div className="my-4">
                        <h3 className="flex items-center gap-2 text-lg text-sky-100 font-semibold cursor-pointer"><span><BsFileEarmarkPost /></span><span>Postagens</span></h3>
                        <div className="text-sky-200 mx-3 flex flex-col gap-2 py-3">
                            <Link to={"/admin/postagens/listar"} className="flex items-center gap-2 hover:text-sky-100 transition"><span><FaList /></span><span>Listar</span></Link>
                            <Link to={"/admin/postagens/nova-postagem"} className="flex items-center gap-2 hover:text-sky-100 transition"><span><FaPlus /></span><span>Criar postagem</span></Link>
                        </div>
                    </div>
                </div>
                <div className="grow flex flex-col bg-sky-100">
                    <div className="bg-sky-500 flex justify-between p-4">
                        <div>

                        </div>
                        <div className="flex items-center gap-3 text-white">
                            <span className="text-sky-100 font-semibold">{userInfo?.username}</span>
                            <span className="border-l pl-3"><FaUser /></span>
                        </div>
                    </div>
                    <div className="grow">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index