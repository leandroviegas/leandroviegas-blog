import React, { useEffect, useState } from "react"

import api from "../../../services/api"
import { useAuth } from "../../../hooks/Auth"

import AdminLayout from "../../../layouts/AdminLayout"
import Alert from "../../../components/Alert"
import Outclick from "../../../components/outclick"
import ReactTextareaAutosize from "react-textarea-autosize"

import { Category } from "../../../types/blog.type"

import { VscLoading } from "react-icons/vsc"
import { BiCategoryAlt } from "react-icons/bi"
import { FaSearch } from "react-icons/fa"
import { IoIosClose } from "react-icons/io"
import { ImWarning } from "react-icons/im"

type Status = "loading" | "success" | "error" | "input-warnings" | "";

const Index = () => {
    const { cookies } = useAuth()

    const [popup, setPopup] = useState<"category-form" | "delete" | "">("");

    const [categories, setCategories] = useState<{ status: Status, data: Category[] }>({ status: "", data: [] })

    const [categoryForm, setCategoryForm] = useState<Category>({ name: "", link: "", image: "", description: "" })

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({ "category-form": [] })

    const [categoryStatus, setCategoryStatus] = useState<Status>("")

    const HandleSaveCategory = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        if (categoryStatus === "loading") return;

        if (["category-form-name", "category-form-link"].some(input => alerts[input].length > 0)) {
            setCategoryStatus("input-warnings");
        } else {
            setCategoryStatus("loading");
            try {
                let headers = { authorization: `Bearer ${cookies.authentication}` }

                if (categoryForm?._id) {
                    await api.put("/categories", categoryForm, { headers })
                } else {
                    await api.post("/categories", categoryForm, { headers })
                }

                setCategoryStatus("success");
                HandleLoadCategories();
                setPopup("")
            } catch (err) {
                console.error(err)
                setCategoryStatus("error");
                setAlerts({ ...alerts, "category-form": [err?.response?.data?.message || `Ocorreu um erro ao ${categoryForm?._id ? "editar" : "adicionar"} categoria!`] })
            }
        }
    }

    const HandleDeleteCategory = () => {
        if (categoryStatus === "loading") return;
        setCategoryStatus("loading");

        api.delete("/categories", { headers: { authorization: `Bearer ${cookies.authentication}` }, params: { _id: categoryForm?._id } })
            .then(resp => {
                setCategoryStatus("success");
                HandleLoadCategories();
                setPopup("");
            }).catch(err => {
                console.error(err)
                setCategoryStatus("error");
                setAlerts({ ...alerts, "category-delete": [err?.response?.data?.message || "Ocorreu um erro ao apagar categoria!"] })
            })
    }

    const HandleLoadCategories = () => {
        if (categories.status === "loading") return;
        setCategories({ status: "loading", data: [] });

        api.get("/categories/list").then(resp => {
            setCategories({ status: "success", data: resp.data?.categories });
        }).catch(err => {
            console.error(err)
            setCategories({ status: "error", data: [] });
            setAlerts({ ...alerts, "category-form": [err?.response?.data?.message || "Ocorreu um erro ao carregar categorias!"] })
        })
    }

    useEffect(() => {
        if (popup === "") {
            setCategoryStatus("");
            setAlerts({})
            setCategoryForm({ name: "", link: "", image: "", description: "" });
        }
    }, [popup])

    useEffect(() => {
        HandleLoadCategories()
    }, [])

    useEffect(() => {
        if (!(categoryForm.name.length > 0))
            setAlerts(a => ({ ...a, "category-form-name": [`Nome é obrigatório`] }))
        else if (!(categoryForm.name.length > 3))
            setAlerts(a => ({ ...a, "category-form-name": [`Nome deve ter no mínimo 3 caracteres`] }))
        else
            setAlerts(a => ({ ...a, "category-form-name": [] }))

        if (!(categoryForm.link.length > 0))
            setAlerts(a => ({ ...a, "category-form-link": [`Link é obrigatório`] }))
        else if (!(categoryForm.link.length > 3))
            setAlerts(a => ({ ...a, "category-form-link": [`Link deve ter no mínimo 3 caracteres`] }))
        else
            setAlerts(a => ({ ...a, "category-form-link": [] }))
    }, [categoryForm])

    return (
        <AdminLayout>
            {popup !== "" &&
                <div className="fixed h-screen w-screen top-0 left-0 bg-black/50 flex items-center justify-center z-20">
                    <Outclick callback={() => setPopup("")}>
                        {popup === "category-form" &&
                            <div data-aos="fade-down" className="bg-white shadow-lg shadow-violet-800/40 rounded-lg w-96 max-w-screen">
                                <div className="flex gap-2 justify-between items-center rounded-t-lg bg-violet-700 text-white py-3">
                                    <h1 className="px-4 text-xl font-bold text-white">{categoryForm?._id ? `Editar categoria - ${categoryForm.name}` : "Nova categoria"}</h1>
                                    <button onClick={() => setPopup("")} className="mx-2 hover:opacity-90 transition hover:scale-110">
                                        <IoIosClose size={35} />
                                    </button>
                                </div>
                                <form onSubmit={HandleSaveCategory} className="m-6">

                                    {alerts["category-form"]?.map(message => <Alert key={message} type="error" message={message} />)}

                                    <div className="my-4">
                                        {(function () {
                                            const error = categoryStatus === "input-warnings" && alerts["category-form-name"].length > 0;
                                            return (
                                                <>
                                                    <div>
                                                        <label>
                                                            <span className={`${error ? "text-red-600" : "text-violet-800"} transition text-sm`}>Nome</span><br />
                                                            <input defaultValue={categoryForm.name} onChange={evt => setCategoryForm({ ...categoryForm, name: evt.target.value })} name="name" autoComplete="off" className={`w-full focus:shadow-lg shadow-violet-700/80 outline-none border-b ${error ? "bg-red-50 border-red-500 text-red-600" : "bg-zinc-100 text-zinc-600"} focus:text-zinc-600 focus:bg-white px-1 pt-1 transition duration-300 ease-in focus:border-violet-800`} type="text" />
                                                        </label>
                                                    </div>
                                                    {alerts["category-form-name"]?.map(message => <span key={message} className={`text-xs ${error ? "text-red-500" : "text-zinc-700"}`}>* {message}</span>)}
                                                </>
                                            )
                                        }())}
                                    </div>
                                    <div className="my-4">
                                        {(function () {
                                            const error = categoryStatus === "input-warnings" && alerts["category-form-link"].length > 0;
                                            return (
                                                <>
                                                    <div>
                                                        <label>
                                                            <span className={`${error ? "text-red-600" : "text-violet-800"} transition text-sm`}>Link</span><br />
                                                            <input defaultValue={categoryForm.link} onChange={evt => setCategoryForm({ ...categoryForm, link: evt.target.value })} name="link" autoComplete="off" className={`w-full focus:shadow-lg shadow-violet-700/80 outline-none border-b ${error ? "bg-red-50 border-red-500 text-red-600" : "bg-zinc-100 text-zinc-600"} focus:text-zinc-600 focus:bg-white px-1 pt-1 transition duration-300 ease-in focus:border-violet-800`} type="text" />
                                                        </label>
                                                    </div>
                                                    {alerts["category-form-link"]?.map(message => <span key={message} className={`text-xs ${categoryStatus === "input-warnings" ? "text-red-500" : "text-zinc-700"}`}>* {message}</span>)}
                                                </>
                                            )
                                        }())}
                                    </div>
                                    <div className="my-4">
                                        <label>
                                            <span className="text-violet-800 text-sm">Descrição</span><br />
                                            <ReactTextareaAutosize className="focus:shadow-lg shadow-violet-700/80 outline-none border-b bg-zinc-100 focus:bg-white rounded-t pt-1 px-1 transition duration-300 ease-in text-zinc-600 w-full focus:border-violet-800" value={categoryForm.description} onChange={evt => setCategoryForm({ ...categoryForm, description: evt.currentTarget.value })} minRows={2} />
                                        </label>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="flex items-center justify-between gap-6 flex-wrap">
                                        <button type="submit" className="bg-violet-700 hover:bg-violet-800 shadow-lg shadow-violet-700/30 rounded-xl text-white py-2 px-4 hover:scale-105 transition font-semibold">{categoryForm?._id ? `Salvar categoria` : "Criar categoria"}</button>
                                        <button type="button" onClick={() => setPopup("")} className="py-2 transition px-4 text-zinc-800 bg-zinc-200 hover:bg-zinc-300 font-semibold rounded-lg">Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        }

                        {popup === "delete" &&
                            <div data-aos="fade-down" className="bg-white max-w-[720px] flex flex-col w-screen h-screen sm:max-h-[16rem] rounded-lg">
                                <div className="grow flex flex-col">
                                    <div className="flex gap-2 justify-between items-center rounded-t-lg bg-violet-700 text-white py-3">
                                        <h1 className="text-xl mx-4 rounded-t-lg">Confirmar exclusão</h1>
                                        <button onClick={() => setPopup("")} className="mx-2 hover:opacity-90 transition hover:scale-110">
                                            <IoIosClose size={35} />
                                        </button>
                                    </div>
                                    <div className="mx-8 my-2 grow flex items-center">
                                        <div className="mr-8">
                                            <ImWarning size={60} />
                                        </div>
                                        <div className="grow">
                                            <hr className="border-zinc-600" />
                                            <p className="font-thin my-2 text-zinc-700">Você tem certeza que deseja apagar a categoria "{categoryForm?.name}". Caso você apague a categoria você não conseguirá recuperar os dados dela.</p>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="flex items-center justify-between gap-6 flex-wrap p-4">
                                    <button onClick={HandleDeleteCategory} className="bg-red-600 hover:bg-red-700 hover:scale-105 text-white font-semibold px-3 transition py-2 rounded-lg">Apagar Categoria</button>
                                    <button type="button" onClick={() => setPopup("")} className="py-2 transition px-4 text-zinc-800 bg-zinc-200 hover:bg-zinc-300 font-semibold rounded-lg">Cancelar</button>
                                </div>
                            </div>
                        }
                    </Outclick>
                </div>
            }

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
                        <div className="my-6">
                            <button onClick={() => setPopup("category-form")} className="shadow-lg shadow-violet-500/30 hover:scale-110 bg-violet-700 hover:bg-violet-800 transition font-semibold text-white px-3 py-1 rounded">Nova Categoria</button>
                        </div>
                        <div className="my-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                            {categories.data.map(category => {
                                return (
                                    <div key={category?._id} className="shadow-xl shadow-violet-700/40 border rounded-xl flex flex-col">
                                        <div className="grow pt-2 pb-1 px-4 text-white bg-violet-700 rounded-t-lg">
                                            <p className="text-xl font-semibold">{category?.name}</p>
                                            <p className="font-thin opacity-80">{category?.description}</p>
                                            <a href={`/blog/category/${category.link}`} target="_blank" className="font-thin text-sm opacity-80 underline">{window.location.hostname}/blog/category/{category.link}</a>
                                        </div>
                                        <hr />
                                        <div className="m-3 font-semibold flex items-center gap-4 flex-wrap">
                                            <button onClick={() => { setCategoryForm(category); setPopup("category-form"); }} className="bg-yellow-400 text-zinc-800 hover:bg-yellow-500 transition rounded px-3 py-1">Editar</button>
                                            <button onClick={() => { setCategoryForm(category); setPopup("delete"); }} className="bg-red-600 text-white hover:bg-red-700 px-3 transition rounded py-1">Apagar</button>
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