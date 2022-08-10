import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import Layout from "../layouts/Layout"
import api from "../services/api"

import Alert, { AlertProps } from "../components/Alert"

import { Category, Post } from "../types/blog.type"
import PostCard from "../components/PostCard"

const BlogPage = () => {

    const [data, setData] = useState<{ category: Category, posts: Post[] }[]>([])

    const [status, setStatus] = useState<"success" | "error" | "loading" | "">("")

    const [alerts, setAlerts] = useState<(AlertProps & { input: string })[]>([])

    const HandleLoadData = () => {
        api.get("posts/by-category").then(resp => {
            setData(resp.data)
            setStatus("success");
        }).catch(err => {
            console.error(err)
            setStatus("error");
            if (err.response.data?.message)
                setAlerts([{ type: "error", message: err.response.data.message, input: "form-post" }])
            else
                setAlerts([{ type: "error", message: "Ocorreu um erro ao carregar categorias!", input: "form-post" }])
        })
    }

    useEffect(() => {
        HandleLoadData()
    }, [])

    return (
        <Layout>
            <div className="container grid grid-cols-1 lg:grid-cols-4 mx-auto">
                <div className="col-span-3 px-4 md:px-8">
                    {data.map(categoryAndPosts => {
                        return (
                            <div className="my-12" key={categoryAndPosts.category._id}>
                                <h1 className="text-2xl mx-4 font-semibold text-zinc-900">{categoryAndPosts.category.name}</h1>
                                <hr className="my-2 border-gray-800" />
                                <div className="md:my-6">
                                    {categoryAndPosts.posts.map((p, i, self) => <PostCard key={p?._id} {...p} />)}
                                </div>
                                <div className="my-4 flex justify-center">
                                    <Link to={`/blog/category/${categoryAndPosts.category.link}`}>
                                        <button className="rounded-xl hover:bg-gray-200 text-gray-600 hover:text-gray-700 transition border px-3 py-1">
                                            Mais postagens
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}

export default BlogPage