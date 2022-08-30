import React from "react"
import { Link } from "gatsby"
import Layout from "../layouts/Layout"
import api from "../services/api"
import { createClient } from 'redis';

import { Topic, Post } from "../types/blog.type"
import PostCard from "../components/PostCard"
import Head from "../components/Head"

export async function getServerData() {
    try {
        const apiGet = api.get("/posts/by-topic");
        try {
            const client = createClient({
                url: process.env.REDIS_URL
            });

            client.on('error', (err) => console.log('Redis Client Error', err));

            await client.connect();

            const data = await client.get('page/blog');

            const redisStore = apiGet.then(resp => { client.set('page/blog', JSON.stringify(resp.data ?? "[]")); return resp; })

            if (data) {
                await redisStore
                return {
                    props: JSON.parse(data ?? "[]"),
                } 
            } else {
                return {
                    props: await redisStore,
                }  
            }
        } catch (error) {
            const data = await apiGet.then(resp => resp.data)

            return {
                props: data,
            }
        }
    } catch (error) {
        return {
            status: 500,
            headers: {},
            props: {}
        }
    }
}

const BlogPage = ({ serverData }) => {
    console.log(serverData)
    const data: { topic: Topic, posts: Post[] }[] = serverData

    return (
        <Layout>
            <Head title={`Veja as postagens dos mais diversos assuntos de tecnologia e programação - Leandro Viegas`} />

            <div className="container grid grid-cols-1 lg:grid-cols-4 mx-auto">
                <div className="col-span-3 px-4 md:px-8">
                    {data.map(topicAndPosts => {
                        return (
                            <div className="my-12" key={topicAndPosts.topic._id}>
                                <h1 className="text-2xl mx-4 font-semibold text-zinc-900">{topicAndPosts.topic.name}</h1>
                                <hr className="my-2 border-gray-800" />
                                <div className="md:my-6">
                                    {topicAndPosts.posts?.map(p => <PostCard key={p?._id} {...p} />)}
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

export default BlogPage