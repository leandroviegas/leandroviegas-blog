import React, { useEffect, useState } from "react"

import api from "../../../services/api"
import { useAuth } from "../../../hooks/Auth"

import AdminLayout from "../../../layouts/AdminLayout"
import Alert, { AlertProps } from "../../../components/Alert"
import Outclick from "../../../components/Outclick"
import ReactTextareaAutosize from "react-textarea-autosize"

import { Category } from "../../../types/blog.type"

import { VscLoading } from "react-icons/vsc"
import { BiCategoryAlt } from "react-icons/bi"
import { FaSearch } from "react-icons/fa"

const Index = () => {
    const { cookies } = useAuth()

    const [popup, setPopup] = useState<"category-form" | "delete" | "">("");

    const [alerts, setAlerts] = useState<(AlertProps & { input: string })[]>([])

    const [categories, setCategories] = useState<{ status: "loading" | "success" | "error" | "", data: Category[] }>({ status: "", data: [] })

    const HandleLoadCategories = () => {
        if (categories.status === "loading") return;
        setCategories({ status: "loading", data: [] });

        api.get("/categories/list").then(resp => {
            setCategories({ status: "success", data: resp.data?.categories });
        }).catch(err => {
            console.error(err)
            setCategories({ status: "error", data: [] });
            if (err.response.data?.message)
                setAlerts([{ type: "error", message: err.response.data.message, input: "category-list" }])
            else
                setAlerts([{ type: "error", message: "Ocorreu um erro ao carregar categorias!", input: "category-list" }])
        })
    }

    const [categoryStatus, setCategoryStatus] = useState<"loading" | "success" | "error" | "">("")

    const [categoryForm, setCategoryForm] = useState<Category>({ name: "", link: "", image: "", description: "" })

    const HandleSaveCategory = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        if (categoryStatus === "loading") return;

        let alerts: (AlertProps & { input: string })[] = []

        if (!(categoryForm.name?.length > 3)) alerts.push({
            input: "category-form-name",
            message: "Nome precisa ter ao menos 4 caracteres.",
            type: "warning"
        })

        if (!(categoryForm.link?.length > 3)) alerts.push({
            input: "category-form-link",
            message: "Link precisa ter ao menos 4 caracteres.",
            type: "warning"
        })

        setAlerts(alerts)

        if (alerts.length === 0) {
            setCategoryStatus("loading");

            if (categoryForm?._id) {
                api.put("/categories", categoryForm, { headers: { authorization: `Bearer ${cookies.authentication}` } }).then(resp => {
                    setCategoryStatus("success");
                    HandleLoadCategories();
                    setPopup("")
                }).catch(err => {
                    console.error(err)
                    setCategoryStatus("error");
                    if (err.response.data?.message)
                        setAlerts([{ type: "error", message: err.response.data.message, input: "category-form" }])
                    else
                        setAlerts([{ type: "error", message: "Ocorreu um erro ao tentar editar categoria!", input: "category-form" }])
                })
            } else {
                api.post("/categories", categoryForm, { headers: { authorization: `Bearer ${cookies.authentication}` } }).then(resp => {
                    setCategoryStatus("success");
                    HandleLoadCategories();
                    setPopup("");
                }).catch(err => {
                    console.error(err)
                    setCategoryStatus("error");
                    if (err.response.data?.message)
                        setAlerts([{ type: "error", message: err.response.data.message, input: "category-form" }])
                    else
                        setAlerts([{ type: "error", message: "Ocorreu um erro ao cadastrar categoria!", input: "category-form" }])
                })
            }
        }
    }

    const HandleDeleteCategory = () => {
        if (categoryStatus === "loading") return;
        setCategoryStatus("loading");

        api.delete("/categories", { headers: { authorization: `Bearer ${cookies.authentication}` }, params: { _id: categoryForm?._id } }).then(resp => {
            setCategoryStatus("success");
            HandleLoadCategories();
            setPopup("");
        }).catch(err => {
            console.error(err)
            setCategoryStatus("error");
            if (err.response.data?.message)
                setAlerts([{ type: "error", message: err.response.data.message, input: "category-delete" }])
            else
                setAlerts([{ type: "error", message: "Ocorreu um erro ao apagar categoria!", input: "category-delete" }])
        })
    }


    useEffect(() => {
        setAlerts([])
        if (popup === "") setCategoryForm({ name: "", link: "", image: "", description: "" });
    }, [popup])

    useEffect(() => {
        HandleLoadCategories()
    }, [])

    return (
        <AdminLayout>
            {popup !== "" &&
                <div className="fixed h-screen w-screen top-0 left-0 bg-black/50 flex items-center justify-center">
                    <Outclick callback={() => setPopup("")}>
                        {popup === "category-form" &&
                            <div data-aos="fade-down" className="bg-white rounded-lg w-96 max-w-screen">
                                <h1 className="text-xl font-semibold text-indigo-800 bg-indigo-100 rounded-t-lg px-4 p-2">{categoryForm?._id ? `Editar categoria - ${categoryForm.name}` : "Nova categoria"}</h1>
                                {alerts.filter(alert => alert.input === "category-form").length > 0 &&
                                    (<div className="p-2">
                                        {alerts.filter(alert => alert.input === "category-form").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                    </div>)}
                                <form onSubmit={HandleSaveCategory} className="m-4">
                                    <div className="my-4">
                                        <input value={categoryForm.name} onChange={evt => setCategoryForm({ ...categoryForm, name: evt.currentTarget.value })} type="text" placeholder="Nome da categoria" className="text-gray-600 outline-none border px-2 py-0.5 rounded mb-2" />
                                        {alerts.filter(alert => alert.input === "category-form-name").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                    </div>
                                    <div className="my-4">
                                        <input value={categoryForm.link} onChange={evt => setCategoryForm({ ...categoryForm, link: evt.currentTarget.value })} type="text" placeholder="Link da categoria" className="text-gray-600 outline-none border px-2 py-0.5 rounded mb-2" />
                                        {alerts.filter(alert => alert.input === "category-form-link").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                    </div>
                                    <div className="my-4">
                                        <ReactTextareaAutosize value={categoryForm.description} onChange={evt => setCategoryForm({ ...categoryForm, name: evt.currentTarget.value })} minRows={2} placeholder="Digite a descrição da categoria" className="text-gray-600  mb-2 outline-none border px-2 py-0.5 rounded w-full" />
                                        {alerts.filter(alert => alert.input === "category-form-description").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                    </div>
                                    <hr className="my-4 text-indigo-800" />
                                    <div>
                                        <button type="submit" className="bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-1 font-semibold">{categoryForm?._id ? `Salvar categoria` : "Criar categoria"}</button>
                                    </div>
                                </form>
                            </div>
                        }

                        {popup === "delete" &&
                            <div data-aos="fade-down" className="bg-white rounded-lg w-96 px-4 p-2 max-w-screen">
                                <h1 className="text-xl font-semibold text-red-800 rounded-t-lg">Apagar Categoria "{categoryForm?.name}"</h1>
                                <hr className="border-red-800 my-2" />
                                {alerts.filter(alert => alert.input === "category-delete").length > 0 &&
                                    (<div className="p-2">
                                        {alerts.filter(alert => alert.input === "category-delete").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                                    </div>)}
                                <div className="m-4">
                                    <button onClick={HandleDeleteCategory} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 transition py-0.5">Apagar Categoria</button>
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
                                <button className="h-full text-center flex items-center px-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-l">
                                    <FaSearch />
                                </button>
                                <input type="text" placeholder="Procurar" className="outline-none h-full px-2 py-1 text-gray-600 border" />
                            </form>
                        </div>
                        <hr className="my-4" />
                        <button onClick={() => setPopup("category-form")} className="bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-white px-3 py-1 rounded">Nova Categoria</button>
                        <div className="my-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                            {categories.data.map(category => {
                                return (
                                    <div key={category?._id} className="border px-4 rounded-lg flex flex-col">
                                        <div className="grow my-2">
                                            <p className="text-xl font-semibold text-zinc-600">{category?.name}</p>
                                            <p className="text-zinc-600 font-thin">{category?.description}</p>
                                            <p className="text-zinc-600 font-thin"><b>link:</b> {category?.link}</p>
                                        </div>
                                        <hr />
                                        <div className="font-semibold">
                                            <button onClick={() => { setCategoryForm(category); setPopup("category-form"); }} className="bg-yellow-400 my-3 mr-3 text-zinc-800 hover:bg-yellow-500 transition px-3 py-0.5">Editar</button>
                                            <button onClick={() => { setCategoryForm(category); setPopup("delete"); }} className="bg-red-500 mb-3 text-white hover:bg-red-600 px-3 transition py-0.5">Apagar</button>
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