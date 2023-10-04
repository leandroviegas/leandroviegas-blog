import React from "react"
import { Link } from "gatsby"
import Layout from "@layouts/UserLayout"
import api from "@services/api"

import { Topic, Post } from "@classes/blog"
import PostCard from "@components/Cards/PostCard"
import Head from "@components/Head"
import axios from "axios"

export async function getServerData() {
    try {
        const data = await axios.get("https://leandroviegas.onrender.com/posts/by-topics").then(resp => resp.data)

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

const BlogPage = ({ serverData }) => {
    const data: { topic: Topic, posts: Post[] }[] = serverData

    return (
        <Layout>
            <Head title={`Veja as postagens dos mais diversos assuntos de tecnologia e programação - Leandro Viegas`} />

            <div className="container grid grid-cols-1 lg:grid-cols-4 mx-auto">
                <div className="col-span-3 px-4 md:px-8 bg-white dark:bg-zinc-900 my-6 rounded">
                    {data?.map(topicAndPosts => {
                        return (
                            <div className="my-12" key={topicAndPosts.topic._id}>
                                <h1 className="text-2xl mx-4 font-semibold text-zinc-900 dark:text-zinc-50">{topicAndPosts.topic.name}</h1>
                                <hr className="my-2 border-gray-800 dark:border-zinc-200" />
                                <div className="md:my-6">
                                    {topicAndPosts.posts?.map(p => <PostCard key={p?._id} {...p} />)}
                                </div>
                                <div className="my-4 flex justify-center">
                                    <Link to={`/blog/topic/${topicAndPosts.topic.link}`}>
                                        <button className="rounded-xl hover:bg-gray-200 text-gray-600 hover:text-gray-700 dark:hover:bg-zinc-500 dark:text-gray-300 dark:hover:text-gray-100 transition border px-3 py-1">
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