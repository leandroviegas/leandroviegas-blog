import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

import api from "../../../services/api"

import moment from "moment"
import Layout from "../../../layouts/Layout"
import Head from "../../../components/head"
import truncate from "../../../utils/truncate"

import { FaUser } from "react-icons/fa"

import { Category, Post } from "../../../types/blog.type"

import '../../../css/suneditor-contents.min.css';

import postplaceholderImage from "../../../images/post_placeholder.jpg"
import notFoundImage from "../../../images/notfound.svg"

export async function getServerData({ params }) {
    try {
        let data = await api.get("posts", { params }).then(resp => ({ ...resp.data, status: resp.status })).catch(err => ({ status: err?.response?.status || 500, post: {} }))
        return { props: data }
    } catch (error) {
        return {
            status: 500,
            headers: {},
            props: {}
        }
    }
}


const Index = ({ serverData }) => {
    const post: Post = serverData?.post;

    const [categories, setCategories] = useState<{ status: "success" | "error" | "loading" | "", data: Category[] }>({ status: "", data: [] })

    useEffect(() => {
        if (categories.status === "loading") return;
        setCategories({ status: "loading", data: [] });

        api.get("/categories/list").then(resp => {
            setCategories({ status: "success", data: resp.data?.categories });
        }).catch(err => {
            console.error(err)
            setCategories({ status: "error", data: [] });
        })
    }, [])

    return (
        <Layout>

            <div className="container mx-auto">
                {serverData?.status === 200 &&
                    <>
                        <Head title={post.title} author={post.author.username} description={post.description} />
                        <div className="h-96 md:h-72 w-full">
                            <img className="w-full h-full object-cover" src={post?.image || postplaceholderImage} alt="" />
                            <div className="h-full md:h-36 flex flex-col bg-gradient-to-t from-black via-black/70 -translate-y-full p-4">
                                <div className="grow"></div>
                                <h1 className="text-2xl text-white font-bold">{post.title}</h1>
                                <p className="text-white text text-gray-100  md:mr-16 my-2">{truncate(post.description, 180)}</p>
                                <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
                                    <span className="text-gray-300 text-semibold text-sm"><span>Postado em: </span>{moment(post?.postedAt).format("DD/MM/YYYY hh:mm")}</span>
                                    <Link to={`/usuario/${post.author.link}`} className="flex items-center gap-2">
                                        <span className="h-6 w-6 flex items-center justify-center">
                                            {post?.author?.profilePicture ?
                                                <img className="w-full h-full object-cotain rounded-full bg-gray-300" src={post.author.profilePicture} alt={post.author.username} />
                                                : <FaUser className="text-gray-100" />}
                                        </span>
                                        <span className="text-sm text-gray-100">{post.author.username}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>}
                <div className="my-4 grid lg:grid-cols-4 gap-4">
                    <div className="overflow-x-auto max-w-screen col-span-4 lg:col-span-3">
                        {serverData?.status === 200 ?
                            <>
                                <div className="mb-4 bg-white rounded-lg sun-editor-editable" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                                <hr className="my-4" />
                                <div className="mx-4 my-4 flex flex-wrap gap-4">
                                    <span className="text-gray-800 text-semibold text-sm"><span>Postado em: </span>{moment(post?.postedAt).format("DD/MM/YYYY hh:mm")}</span>
                                    <span className="text-gray-800 text-semibold text-sm"><span>Editado em: </span>{moment(post?.modifiedAt).format("DD/MM/YYYY hh:mm")}</span>
                                </div>
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
                        <div className="bg-white rounded-lg w-full p-4 sticky top-2">
                            <h2 className="text-lg text-zinc-700 font-semibold">Categorias</h2>
                            <hr />
                            <div className="flex flex-wrap gap-2 my-3">
                                {
                                    categories.data.map(category => {
                                        return (
                                            <Link key={category.link} to={`/blog/category/${category.link}`}>
                                                <button className="border border-indigo-700 text-indigo-800 px-3 rounded" key={category._id}>
                                                    {category.name}
                                                </button>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default Index