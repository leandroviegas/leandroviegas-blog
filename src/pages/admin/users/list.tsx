import React, { useEffect, useState } from "react"

import api from "@services/api"
import { useAuth } from "@hooks/Auth"

import { User } from "types/blog.type"

import Head from "@components/Head"
import AdminLayout from "@layouts/AdminLayout"
import DeletePopup from "@components/Popups/DeletePopup"
import UserForm from "@components/Forms/UserForm"

import { VscLoading } from "react-icons/vsc"
import { FaSearch } from "react-icons/fa"

import OpaqueBackground from "@components/OpaqueBackground"
import truncate from "@utils/truncate"

type Status = "loading" | "success" | "error" | ""

const Index = () => {
    const { cookies } = useAuth()

    const [popup, setPopup] = useState<"user-form" | "delete" | "">("");

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const [users, setUsers] = useState<{ status: Status, data: User[] }>({ status: "", data: [] })

    const HandleLoadUsers = () => {
        if (users.status === "loading") return;
        setUsers({ status: "loading", data: [] });

        const headers = { authorization: `Bearer ${cookies.authentication}` }

        api.get("/users/list", { headers }).then(resp => {
            setUsers({ status: "success", data: resp.data?.users });
        }).catch(err => {
            console.error(err)
            setUsers({ status: "error", data: [] });
            setAlerts({ ...alerts, "user-list": [err?.response?.data?.message || "Ocorreu um erro ao carregar usuários!"] })
        })
    }

    const [deleteStatus, setDeleteStatus] = useState<Status>()

    const [selectedUser, setSelectedUser] = useState<User>()

    const HandleDeleteUser = (_id = "") => {
        if (deleteStatus === "loading") return;
        setDeleteStatus("loading");
        api.get(selectedUser?.active ? `/users/deactive` : `/users/active`, { params: { _id: selectedUser?._id ?? _id }, headers: { authorization: `Bearer ${cookies.authentication}` } }).then(resp => {
            HandleLoadUsers();
            setSelectedUser(undefined)
            setDeleteStatus("success")
            setAlerts({ ...alerts, "user-delete": [] });
            setPopup("")
        }).catch(err => {
            console.error(err)
            setDeleteStatus("error")
            setAlerts({ ...alerts, "user-delete": [err?.response?.data?.message || "Ocorreu um erro ao deletar usuário!"] })
        })

    }

    useEffect(() => {
        HandleLoadUsers()
    }, [])

    return (
        <AdminLayout>
            <Head title="Listar usuários - Leandro Viegas" />

            <OpaqueBackground open={popup === "user-form"} closeCallback={() => setPopup("")}>
                <div data-aos="fade-down" className="bg-white shadow-lg shadow-indigo-800/40 rounded-lg w-96 max-w-screen">
                    <UserForm onClose={() => setPopup("")} onSuccess={() => { setPopup(""); HandleLoadUsers(); }} user={selectedUser} />
                </div>
            </OpaqueBackground>

            <DeletePopup status={deleteStatus === "loading" ? deleteStatus : ""} errors={alerts["user-delete"]} btnText="Desativar usuário" open={popup === "delete"} onDelete={HandleDeleteUser} onCancel={() => { setSelectedUser(undefined); setAlerts({ ...alerts, "user-delete": [] }); setPopup("") }} text={`Você tem certeza que deseja desativar esse usuário "${selectedUser?.username}".`} />

            {(users.status === "success" && users.data.length > 0) &&
                <div className="container">
                    <div className="bg-white rounded-lg p-4 mx-4 my-8 shadow-lg">
                        <div className="flex gap-2 my-4">
                            <form className="h-8 flex items-center">
                                <button className="h-full text-center flex items-center px-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-l">
                                    <FaSearch />
                                </button>
                                <input type="text" placeholder="Procurar" className="outline-none h-full px-2 py-1 text-gray-500 border" />
                            </form>
                        </div>
                        <hr className="my-4" />
                        <div className="my-6">
                            <button onClick={() => setPopup("user-form")} className="shadow-lg shadow-indigo-500/30 hover:scale-110 bg-indigo-500 hover:bg-indigo-700 transition font-semibold text-white px-3 py-1 rounded">
                                Novo usuário
                            </button>
                        </div>
                        <div className="my-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                            {users.data?.map(user => {
                                return (
                                    <div key={user?._id} className="border border-zinc-300 rounded-xl flex flex-col">
                                        <div className="grow pt-2 flex flex-col gap-2 pb-2 px-4 w-full text-zinc-700 rounded-t-lg break-words">
                                            <p className="text-xl font-semibold">{user?.username}</p>
                                            <p className="font-thin opacity-80 whitespace-normal">{truncate(user?.about, 100)}</p>
                                            <a href={`/blog/user/${user?.link}`} target="_blank" className="text-sm opacity-80 underline">/blog/user/{user?.link}</a>
                                        </div>
                                        <hr />
                                        <div className="p-3  bg-indigo-500 shadow-xl shadow-indigo-500/40 rounded-b-xl font-semibold flex items-center gap-4 flex-wrap">
                                            <button onClick={() => { setSelectedUser(user); setPopup("user-form"); }} className="bg-yellow-400 text-zinc-800 hover:bg-yellow-500 transition rounded px-3 py-1">Editar</button>
                                            {user.active == true ?
                                                <button onClick={() => { setSelectedUser(user); setPopup("delete"); }} className="bg-red-500 text-white hover:bg-red-700 px-3 transition rounded py-1">Desativar</button>
                                                :
                                                <button onClick={() => HandleDeleteUser(user?._id || "")} className="bg-green-500 text-white hover:bg-green-700 px-3 transition rounded py-1">Ativar</button>
                                            }

                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }

            {users.status === "loading" &&
                <div className="h-full w-full flex items-center justify-center">
                    <div className="text-indigo-700"><VscLoading className="animate-spin text-5xl" /></div>
                </div>}
        </AdminLayout>
    )
}

export default Index