import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

import api from "@services/api"

import moment from "moment"
import Layout from "@layouts/UserLayout"
import Head from "@components/Head"
import truncate from "@utils/truncate"

import cookie from 'cookie';

import { FaUser } from "react-icons/fa"

import { Topic, Post, User } from "types/blog.type"

import { BsLinkedin, BsGithub } from 'react-icons/bs'

import "@styles/suneditor-contents.min.css"
import "@styles/blog-post.css"

import postplaceholderImage from "@images/post_placeholder.jpg"
import notFoundImage from "@images/notfound.svg"

export async function getServerData({ params}) {
    try {
        let data = await api.get("posts", { params }).then(resp => ({ ...resp.data, status: resp.status })).catch(err => ({ status: err?.response?.status || 500, post: {} }))
        return { status: data.status === 404 ? 404 : 200, props: data }
    } catch (error) {
        return {
            status: 500,
            headers: {},
            props: {}
        }
    }
}

const Index = ({ serverData }) => {
    const post: Omit<Post, "author"> & { author: User } = serverData?.post;

    const author: User = post.author;

    const [topics, setTopics] = useState<{ status: "success" | "error" | "loading" | "", data: Topic[] }>({ status: "", data: [] })

    useEffect(() => {
        if (topics.status === "loading") return;
        setTopics({ status: "loading", data: [] });

        api.get("/topics/list").then(resp => {
            setTopics({ status: "success", data: resp.data?.topics });
        }).catch(err => {
            console.error(err)
            setTopics({ status: "error", data: [] });
        })
    }, [])

    return (
        <Layout>
            <div className="h-full w-full">
                <div className="container mx-auto">
                    {serverData?.status === 200 &&
                        <>
                            <Head title={post?.title} author={author?.username} description={post?.description} />
                            <div className="h-96 lg:h-72 w-full">
                                <img className="w-full h-full object-cover" src={post?.image || postplaceholderImage} alt="" />
                                <div className="h-full flex flex-col bg-gradient-to-t from-black via-black/70 -translate-y-full p-4">
                                    <div className="grow"></div>
                                    <h1 className="text-3xl text-white font-bold">{post?.title}</h1>
                                    <p className="text-gray-100 md:mr-16 mt-4 mb-2">{truncate(post?.description, 180)}</p>
                                    <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
                                        <span className="text-gray-300 text-semibold text-sm"><span>Postado em: </span>{moment(post?.postedAt).format("DD/MM/YYYY hh:mm")}</span>
                                        <Link to={``} className="flex items-center gap-2">
                                            <span className="h-6 w-6 flex items-center justify-center">
                                                {post?.author?.profilePicture ?
                                                    <img className="w-full h-full object-cotain rounded-full bg-gray-300" src={author.profilePicture} alt={author?.username} />
                                                    : <FaUser className="text-gray-100" />}
                                            </span>
                                            <span className="text-sm text-gray-100">{author.username}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>}
                    <div className="py-4 grid lg:grid-cols-4 gap-4">
                        <div className="overflow-x-auto max-w-screen col-span-4 lg:col-span-3 border-r">
                            {serverData?.status === 200 ?
                                <>
                                    <div className="mb-4 mr-4 rounded-lg sun-editor-editable bg-white" dangerouslySetInnerHTML={{ __html: post?.content }}></div>
                                    <div className="mx-4 my-4 flex flex-wrap gap-4">
                                        <span className="text-gray-800 text-semibold text-sm"><span>Postado em: </span>{moment(post?.postedAt).format("DD/MM/YYYY hh:mm")}</span>
                                        <span className="text-gray-800 text-semibold text-sm"><span>Editado em: </span>{moment(post?.modifiedAt).format("DD/MM/YYYY hh:mm")}</span>
                                    </div>
                                    <hr className="my-4" />
                                </>
                                :
                                <div className="w-full flex flex-col my-16 items-center justify-center">
                                    {serverData?.status === 404 ?
                                        <>
                                            <Head title="404 - Postagem não encontrada - Leandro Viegas" description="A postagem que você estava procurando não foi encontrada." />
                                            <img className="mx-auto w-64 max-w-screen my-4" src={notFoundImage} alt="Not found image" />
                                            <h2 className="text-lg font-thin">Postagem não encontrada.</h2>
                                            <Link className="text-cyan-500 hover:text-cyan-600 hover:underline" to="/">Ir para a Página Inicial</Link>
                                        </> :
                                        <>
                                            <Head title="Ocorreu um erro ao tentar carregar os dados - Leandro Viegas" description="Ocorreu um erro ao tentar carregar os dados tente novamente mais tarde." />
                                            <img className="mx-auto w-64 max-w-screen my-4" src={notFoundImage} alt="Not found image" />
                                            <h2 className="text-lg font-thin">Ocorreu um erro inesperado.</h2>
                                            <Link className="text-cyan-500 hover:text-cyan-600 hover:underline" to="/">Ir para a Página Inicial</Link>
                                        </>}
                                </div>}
                        </div>
                        <div className="col-span-4 lg:col-span-1">
                            <div className="sticky top-4">
                                <div className="hover:scale-105 ease-in duration-300 writer-card rounded-lg shadow-xl border pb-8 pt-6 bg-white hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                    <img src={author?.profilePicture || "https://via.placeholder.com/150"} alt={`${author?.username} Profile Picture`}
                                        className="object-cover z-10 relative w-24 h-24 mx-auto rounded-full shadow-xl p-[3px]" />
                                    <blockquote className="flex flex-col justify-between text-center">
                                        <p className="username text-lg font-bold text-gray-700">{author?.username}</p>
                                        <p className="role mt-1 text-xs font-medium text-gray-500">
                                            {author?.role}
                                        </p>
                                        {author?.about &&
                                            <p className="about mt-4 text-sm text-gray-500">
                                                {author?.about}
                                            </p>}
                                    </blockquote>
                                    {(author?.linkedin || author?.github) &&
                                        <div className="flex justify-center gap-3 mt-4 text-xl text-zinc-800">
                                            {author?.linkedin && <a href={"https://www.linkedin.com/in/" + author.linkedin} target="_blank">
                                                <BsLinkedin />
                                            </a>}
                                            {author?.github && <a href={"https://www.github.com/" + author.github} target="_blank">
                                                <BsGithub />
                                            </a>}
                                    </div>}
                                </div>

                                <div className="shadow-lg rounded-lg w-full bg-white p-4 relative top-6">
                                    <h2 className="text-lg text-zinc-800 font-semibold">Tópicos</h2>
                                    <hr className="my-2" />
                                    <div className="flex flex-wrap gap-2 my-3">
                                        {topics.data.map(topic => {
                                            return (
                                                <Link key={topic.link} to={`/blog/topic/${topic.link}`}>
                                                    <button className="bg-purple-500 hover:bg-violet-00 rounded text-white py-0.5 px-3" key={topic._id}>
                                                        {topic.name}
                                                    </button>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default Index