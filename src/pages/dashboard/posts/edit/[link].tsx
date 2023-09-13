import React, { useEffect, useState } from "react";

import api from "@services/api";

import Form from "@components/Forms/PostForm";
import Head from "@components/Head";
import Alert from "@components/Alert";
import DashboardLayout from "@layouts/DashboardLayout";

import { Post } from "types/blog.type";
import { VscLoading } from "react-icons/vsc";

const Index = ({ params }) => {
    const [status, setStatus] = useState<"loading" | "success" | "error" | "">("")

    const [post, setPost] = useState<Omit<Post, "topics" > & { topics: string[] }>();
    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    useEffect(() => {
        setStatus("loading");
        api.get("/posts", { params: { link: params.link } }).then(resp => {
            setStatus("success");
            setPost(resp.data?.post)
        }).catch(err => {
            setStatus("error");
            setAlerts({ "page": [err?.response?.data?.message || `Erro ao carregar  postagem.`] })
        })
    }, [params.link])

    return (
        <DashboardLayout>
            <Head title={`${post?.title || "Editar postagem"} - Leandro Viegas`} />

            <div className="container pt-8 p-4 h-full">
                {status === "success" &&
                    <Form {...post} />}

                {status === "loading" &&
                    <div className="flex justify-center my-44">
                        <VscLoading className="text-5xl animate-spin text-indigo-800" />
                    </div>}

                {alerts["post-form"]?.map((message, index) => <Alert key={index} message={message} type="error" />)}
            </div>
        </DashboardLayout>
    );
}

export default Index