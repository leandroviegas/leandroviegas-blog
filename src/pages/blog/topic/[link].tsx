import React, { useEffect, useState } from "react"

import Layout from "@layouts/UserLayout"
import api from "@services/api"

import { Topic, Post } from "@classes/blog"

import PostCard from "@components//Cards/PostCard"
import Head from "@components/Head"

export async function getServerData({ params }) {
    try {
        const data = await api.get(`/posts/by-topic?topic_link=${params.link}`).then(resp => resp.data)

        return {
            props: data,
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            headers: {},
            props: {}
        }
    }
}

const TopicPage = ({ serverData }) => {
    const [data, setData] = useState<{ status: "loading" | "error" | "success", topic: Topic, posts: Post[], total: number }>({ ...serverData, status: "success" })

    const [page, setPage] = useState<number>(Math.max(0, serverData.page))

    const HandleLoadMorePosts = () => {
        setData({ ...data, status: "loading" })
        api.get(`/posts/by-topic`, { params: { topic_link: data.topic.link, page: page + 1 } }).then(response => {
            setPage(page + 1)
            setData({ ...data, posts: data.posts + response.data.posts, status: "success" })
        }).catch(e => {
            console.error(e)
            setData({ ...data, status: "error" })
        })
    }

    return (
        <Layout>
            <Head title={`${data.topic.name} - Leandro Viegas`} description="Sou desenvolvedor e trabalho com diversas tecnologias" />

            <div className="container grid grid-cols-1 lg:grid-cols-4 mx-auto">
                <div className="col-span-3 px-4 md:px-8 bg-white dark:bg-zinc-900 my-8 rounded">
                    <div className="my-12">
                        <h1 className="text-2xl mx-4 font-semibold text-zinc-900 dark:text-zinc-50">{data.topic.name}</h1>
                        <hr className="my-2 border-gray-800 dark:border-zinc-200" />
                        <div className="md:my-6">
                            {data.posts.map((p) => <PostCard key={p.link}  {...p} />)}
                        </div>
                        <div className="my-4 flex justify-center">
                            {Math.max(1, page) >= (data.total / 25) ??
                                <button onClick={HandleLoadMorePosts} className="rounded-xl hover:bg-gray-200 text-gray-600 hover:text-gray-700 dark:hover:bg-zinc-500 dark:text-gray-300 dark:hover:text-gray-100 transition border px-3 py-1">
                                    Carregar mais
                                </button>}
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default TopicPage