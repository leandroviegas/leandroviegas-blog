import { useEffect, useState } from "react"

import api, { authorization } from "../../../Services/api"

import AdminLayout from "../../../Layouts/AdminLayout"

import Alert, { AlertProps } from "../../../Components/Alert"

import { Category, Post } from "../../../Types/Post"

import { VscLoading } from "react-icons/vsc"
import { BiCategoryAlt } from "react-icons/bi"
import { FaSearch } from "react-icons/fa"

const Index = () => {

    const [alerts, setAlerts] = useState<(AlertProps & { input: string })[]>([])

    const [posts, setPosts] = useState<{ status: "loading" | "success" | "error" | "", data: Post[] }>({ status: "", data: [] })

    const [popup, setPopup] = useState<"category-form" | "delete" | "">("");

    const HandleLoadCategories = () => {
        if (posts.status === "loading") return;
        setPosts({ status: "loading", data: [] });

        api.get("/categories/list").then(resp => {
            setPosts({ status: "success", data: resp.data?.categories });
        }).catch(err => {
            console.error(err)
            setPosts({ status: "error", data: [] });
            if (err.response.data?.message)
                setAlerts([{ type: "error", message: err.response.data.message, input: "post-list" }])
            else
                setAlerts([{ type: "error", message: "Ocorreu um erro ao carregar postagens!", input: "post-list" }])
        })
    }

    useEffect(() => {
        HandleLoadCategories()
    }, [])

    return (
        <AdminLayout>
            {(posts.status === "success" && posts.data.length > 0) &&
                <div className="container">
                    <div className="bg-white rounded-lg p-4 mx-4 my-8 shadow-lg">
                        <div className="flex gap-2 my-4">
                            <form className="h-8 flex items-center">
                                <button className="h-full text-center flex items-center px-2 bg-sky-700 hover:bg-sky-800 text-white rounded-l">
                                    <FaSearch />
                                </button>
                                <input type="text" placeholder="Procurar" className="outline-none h-full px-2 py-1 text-gray-600 border" />
                            </form>
                        </div>
                        <hr />
                        <button onClick={() => setPopup("category-form")} className="bg-sky-600 hover:bg-sky-700 mt-4 transition font-semibold text-white px-3 py-1 rounded">Nova Categoria</button>
                        <div className="my-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                            {posts.data.map(post => {
                                return (
                                    <div key={post?._id} className="border px-4 rounded-lg flex flex-col">
                                        <div className="grow my-2">
                                            <p className="text-xl font-semibold text-zinc-600">{post?.title}</p>
                                            <p className="text-zinc-600 font-thin">{post?.description}</p>
                                            <p className="text-zinc-600 font-thin"><b>link:</b> {post?.link}</p>
                                        </div>
                                        <hr />
                                        <div className="font-semibold">
                                            <button className="bg-yellow-400 my-3 mr-3 text-zinc-800 hover:bg-yellow-500 transition px-3 py-0.5">Editar</button>
                                            <button className="bg-red-500 mb-3 text-white hover:bg-red-600 px-3 transition py-0.5">Apagar</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }

            {posts.status === "loading" &&
                <div className="h-full w-full flex items-center justify-center">
                    <div className="text-sky-700"><VscLoading className="animate-spin text-5xl" /></div>
                </div>}

            {(posts.status === "success" && posts.data.length === 0) &&
                <div className="h-full flex flex-col">
                    <div className="mt-8 mx-2 md:mx-6">
                        <hr className="border-sky-800" />
                        <div className="flex gap-6 text-sky-800 mt-6">
                            <BiCategoryAlt className="text-4xl mt-3" />
                            <div>
                                <h2 className="text-2xl font-bold">Nenhuma postagem criada ainda</h2>
                                <p className="text-sky-700 text-xl my-1 font-semibold">Que tal criar uma postagem nova?</p>
                                <button onClick={() => setPopup("category-form")} className="bg-sky-600 hover:bg-sky-700 transition font-semibold text-white px-3 py-1 rounded my-4">Nova Postagem</button>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </AdminLayout>
    )
}

export default Index