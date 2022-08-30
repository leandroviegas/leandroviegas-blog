import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

import Layout from "../../../layouts/Layout"
import api from "../../../services/api"

import { Topic, Post } from "../../../types/blog.type"

import PostCard from "../../../components/PostCard"

const TopicPage = ({ params }) => {
    const link = params.link

    const [data, setData] = useState<{ topic: Topic, posts: Post[] }[]>([])

    const [status, setStatus] = useState<"success" | "error" | "loading" | "">("")

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const HandleLoadData = () => {
        api.get("posts/by-topic", { params: { topic_list: [link], post_quantity: 25 } }).then(resp => {
            setData(resp.data)
            setStatus("success");
        }).catch(err => {
            console.error(err)
            setStatus("error");
            setAlerts(a => ({ ...a, "form-post": [err.response.data?.message || "Ocorreu um erro ao carregar tópicos!"] }));
        })
    }

    useEffect(() => {
        HandleLoadData()
    }, [link])

    return (
        <Layout>
            <div className="container grid grid-cols-1 lg:grid-cols-4 mx-auto">
                <div className="col-span-3 px-4 md:px-8">
                    {data.map(topicAndPosts => {
                        return (
                            <div className="my-12" key={topicAndPosts.topic._id}>
                                <h1 className="text-2xl mx-4 font-semibold text-zinc-900">{topicAndPosts.topic.name}</h1>
                                <hr className="my-2 border-gray-800" />
                                <div className="md:my-6">
                                    {topicAndPosts.posts.map(p => <PostCard key={p?._id} {...p} />)}
                                </div>
                                <div className="my-4 flex justify-center">
                                    <Link to={`/blog/topic/${topicAndPosts.topic.link}`}>
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

export default TopicPage