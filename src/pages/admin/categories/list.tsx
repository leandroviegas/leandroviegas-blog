import React, { useEffect, useState } from "react"

import api from "../../../services/api"
import { useAuth } from "../../../hooks/Auth"
import truncate from "../../../utils/truncate"

import OpaqueBackground from "../../../components/OpaqueBackground"
import AdminLayout from "../../../layouts/AdminLayout"
import DeletePopup from "../../../components/Popups/DeletePopup"
import CategoryForm from "../../../components/Forms/CategoryForm"
import Alert from "../../../components/Alert"
import Head from "../../../components/Head"

import { Category } from "../../../types/blog.type"

import { VscLoading } from "react-icons/vsc"
import { BiCategoryAlt } from "react-icons/bi"
import { FaSearch } from "react-icons/fa"

type Status = "loading" | "success" | "error" | "input-warnings" | "";

const Index = () => {
    const { cookies } = useAuth()

    const [popup, setPopup] = useState<"category-form" | "delete" | "">("");

    const [categories, setCategories] = useState<{ status: Status, data: Category[] }>({ status: "", data: [] })

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const HandleLoadCategories = () => {
        if (categories.status === "loading") return;
        setCategories({ status: "loading", data: [] });

        api.get("/categories/list").then(resp => {
            setCategories({ status: "success", data: resp.data?.categories });
        }).catch(err => {
            console.error(err)
            setCategories({ status: "error", data: [] });
            setAlerts({ ...alerts, "category": [err?.response?.data?.message || "Ocorreu um erro ao carregar categorias!"] })
        })
    }

    const [selectedCategory, setSelectedCategory] = useState<Category>({ name: "", link: "", image: "", description: "" })

    const [deleteStatus, setDeleteStatus] = useState<Status>("")

    const HandleDeleteCategory = () => {
        if (deleteStatus === "loading") return;
        setDeleteStatus("loading");

        api.delete("/categories", { headers: { authorization: `Bearer ${cookies.authentication}` }, params: { _id: selectedCategory?._id } })
            .then(resp => {
                setDeleteStatus("success");
                HandleLoadCategories();
                setPopup("");
            }).catch(err => {
                console.error(err)
                setDeleteStatus("error");
                setAlerts({ ...alerts, "category-delete": [err?.response?.data?.message || "Ocorreu um erro ao apagar categoria!"] })
            })
    }

    useEffect(() => {
        if (popup === "") {
            setAlerts({})
            setSelectedCategory({ name: "", link: "", image: "", description: "" });
        }
    }, [popup])

    useEffect(() => {
        HandleLoadCategories()
    }, [])

    return (
        <AdminLayout>
            <Head title={`Listar categorias - Leandro Viegas`} />

            <OpaqueBackground open={popup === "category-form"} callback={() => setPopup("")}>
                <div data-aos="fade-down" className="bg-white shadow-lg shadow-violet-800/40 rounded-lg w-96 max-w-screen">
                    <CategoryForm onClose={() => setPopup("")} category={selectedCategory} />
                </div>
            </OpaqueBackground>

            <DeletePopup status={deleteStatus === "loading" ? deleteStatus : ""} errors={alerts["category-delete"]} btnText="Apagar categoria" open={popup === "delete"} onDelete={HandleDeleteCategory} onCancel={() => setPopup("")} text={`Você tem certeza que deseja apagar a categoria "${selectedCategory?.name}". Caso você apague a categoria você não conseguirá recuperar os dados dela.`} />

            {(categories.status === "success" && categories.data.length > 0) &&
                <div className="container">
                    <div className="bg-white rounded-lg p-4 mx-4 my-8 shadow-lg">
                        <div className="flex gap-2 my-4">
                            <form className="h-8 flex items-center">
                                <button className="h-full text-center flex items-center px-2 bg-violet-800 hover:bg-violet-900 text-white rounded-l">
                                    <FaSearch />
                                </button>
                                <input type="text" placeholder="Procurar" className="outline-none h-full px-2 py-1 text-gray-600 border" />
                            </form>
                        </div>
                        <hr className="my-4" />
                        {alerts[""]?.map((message, index) => <Alert key={index} message={message} type="error" />)}
                        <div className="my-6">
                            <button onClick={() => setPopup("category-form")} className="shadow-lg shadow-violet-500/30 hover:scale-110 bg-violet-700 hover:bg-violet-800 transition font-semibold text-white px-3 py-1 rounded">Nova Categoria</button>
                        </div>
                        <div className="my-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                            {categories.data.map(category => {
                                return (
                                    <div key={category?._id} className="border border-zinc-300 rounded-xl flex flex-col">
                                        <div className="grow pt-2 flex flex-col gap-2 pb-2 px-4 w-full text-zinc-700 rounded-t-lg break-words">
                                            <p className="text-xl font-semibold">{category?.name}</p>
                                            <p className="font-thin opacity-80 whitespace-normal">{truncate(category?.description, 100)}</p>
                                            <a href={`/blog/category/${category.link}`} target="_blank" className="text-sm opacity-80 underline">/blog/category/{category.link}</a>
                                        </div>
                                        <hr />
                                        <div className="p-3  bg-violet-700 shadow-xl shadow-violet-700/40 rounded-b-xl font-semibold flex items-center gap-4 flex-wrap">
                                            <button onClick={() => { setSelectedCategory(category); setPopup("category-form"); }} className="bg-yellow-400 text-zinc-800 hover:bg-yellow-500 transition rounded px-3 py-1">Editar</button>
                                            <button onClick={() => { setSelectedCategory(category); setPopup("delete"); }} className="bg-red-600 text-white hover:bg-red-700 px-3 transition rounded py-1">Apagar</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }

            {categories.status === "loading" &&
                <div className="h-full w-full flex items-center justify-center">
                    <div className="text-indigo-700"><VscLoading className="animate-spin text-5xl" /></div>
                </div>}

            {(categories.status === "success" && categories.data.length === 0) &&
                <div className="h-full flex flex-col">
                    <div className="mt-8 mx-2 md:mx-6">
                        <hr className="border-indigo-800" />
                        <div className="flex gap-6 text-indigo-800 mt-6">
                            <BiCategoryAlt className="text-4xl mt-3" />
                            <div>
                                <h2 className="text-2xl font-bold"> Nenhuma categoria criada ainda</h2>
                                <p className="text-indigo-700 text-xl my-1 font-semibold">Que tal criar uma categoria nova?</p>
                                <button onClick={() => setPopup("category-form")} className="bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-white px-3 py-1 rounded my-4">Nova Categoria</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </AdminLayout>
    )
}

export default Index