import React, { useState } from "react"

import Layout from "@layouts/UserLayout"
import api from "@services/api"

import { Post, User } from "@classes/blog"

import PostCard from "@components/Cards/PostCard"
import Head from "@components/Head"
import { BsGithub, BsLinkedin } from "react-icons/bs"

export async function getServerData({ params }) {
    try {
        const data = await api.get(`/posts/by-author?user_link=${params.link}`).then(resp => resp.data)
        return {
            status: data.status === 404 ? 404 : 200,
            props: data,
        }
    } catch (error) {
        return {
            status: 500,
            headers: {},
            props: {}
        }
    }
}

const TopicPage = ({ serverData }) => {
    const [data, setData] = useState<{ status: "loading" | "error" | "success", user: User, posts: Post[], total: number }>({ ...serverData, status: "success" })

    const [page, setPage] = useState<number>(Math.max(0, serverData.page))

    const HandleLoadMorePosts = () => {
        setData({ ...data, status: "loading" })
        api.get(`/posts/by-author`, { params: { user_link: data.user.link, page: page + 1 } }).then(response => {
            setPage(page + 1)
            setData({ ...data, posts: data.posts + response.data.posts, status: "success" })
        }).catch(e => {
            console.error(e)
            setData({ ...data, status: "error" })
        })
    }

    return (
        <Layout>
            <Head title={`${data.user.username} - Leandro Viegas`} description="Sou desenvolvedor e trabalho com diversas tecnologias" />

            <div className="container grid grid-cols-1 lg:grid-cols-4 mx-auto">
                <div className="col-span-3 px-4 md:px-8 bg-white dark:bg-zinc-900 my-8 rounded">
                    <div className="my-12">
                        <div className="duration-300 mb-6 rounded-lg shadow-xl pb-8 pt-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            <img src={data?.user?.profilePicture || "https://via.placeholder.com/150"} alt={`${data?.user?.username} Profile Picture`}
                                className="object-cover z-10 relative w-24 h-24 mx-auto rounded-full shadow-xl border-white border-[3px]" />
                            <blockquote className="flex flex-col justify-between text-center mt-2">
                                <p className="username text-2xl font-bold text-white">{data?.user?.username}</p>
                                <p className="role mt-1 text-xs font-medium white">
                                    {data?.user?.ocupation}
                                </p>
                                {data?.user?.about &&
                                    <p className="about mt-4 text-sm text-white dark:bg-black">
                                        {data?.user?.about}
                                    </p>}
                            </blockquote>
                            {(data?.user?.linkedin || data?.user?.github) &&
                                <div className="flex justify-center gap-3 mt-4 text-xl text-white">
                                    {data?.user?.linkedin && <a href={"https://www.linkedin.com/in/" + data?.user?.linkedin} target="_blank">
                                        <BsLinkedin />
                                    </a>}
                                    {data?.user?.github && <a href={"https://www.github.com/" + data?.user?.github} target="_blank">
                                        <BsGithub />
                                    </a>}
                                </div>}
                        </div>
                        <hr className="my-2 border-gray-800 dark:border-zinc-200" />
                        <div className="md:my-6">
                            {data.posts.map((p) => <PostCard key={p.link} {...p} />)}
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