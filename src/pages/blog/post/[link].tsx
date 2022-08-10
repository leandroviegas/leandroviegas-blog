import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

import api from "../../../services/api"
import moment from "moment"
import truncate from "../../../Utils/truncate"
import '../../../css/suneditor-contents.min.css';

import { Category, Post } from "../../../Types/blog.type"

import Layout from "../../../layouts/Layout"

import { AlertProps } from "../../../components/Alert"
import { FaUser } from "react-icons/fa"

import postplaceholderImage from "../../../images/post_placeholder.jpg"

const Index = ({ params }) => {

    const link = params.link

    const [post, setPost] = useState<Post>({
        title: "",
        description: "",
        keywords: "",
        content: "",
        link: "",
        category: {
            name: "",
            image: "",
            link: "",
            description: "",
        },
        active: true,
        author: {
            username: "",
            role: "author",
            profilePicture: "",
            link: ""
        },
        modifiedAt: new Date(),
        postedAt: new Date(),
        readTime: 0,
        image: ""
    })

    const [seo, setSeo] = useState<{ title: string, description: string, image: string, keywords: string, type: string, locale: string }>()

    const [alerts, setAlerts] = useState<(AlertProps & { input: string })[]>([])

    const [categories, setCategories] = useState<{ status: "success" | "error" | "loading" | "", data: Category[] }>({ status: "", data: [] })

    const [status, setStatus] = useState<"loading" | "success" | "error" | "">("")

    const HandleLoadPost = () => {
        api.get("posts", { params: { link } }).then(resp => {
            setPost(resp.data.post)
            setSeo({
                title: resp.data?.post?.title,
                description: resp.data?.post?.description,
                image: resp.data?.post?.image,
                keywords: resp.data?.post?.keywords,
                locale: "pt_BR",
                type: "website"
            })
        }).catch(err => {
            console.error(err)
            setStatus("error");
        })
    }

    const HandleLoadCategories = () => {
        if (categories.status === "loading") return;
        setCategories({ status: "loading", data: [] });

        api.get("/categories/list").then(resp => {
            setCategories({ status: "success", data: resp.data?.categories });
        }).catch(err => {
            console.error(err)
            setCategories({ status: "error", data: [] });
            if (err.response.data?.message)
                setAlerts([{ type: "error", message: err.response.data.message, input: "post-list" }])
            else
                setAlerts([{ type: "error", message: "Ocorreu um erro ao carregar postagens!", input: "post-list" }])
        })
    }

    useEffect(() => {
        HandleLoadPost()
        HandleLoadCategories()
    }, [link])

    return (
        <Layout>
            <div className="container mx-auto">
                <div className="h-96 md:h-72 w-full">
                    <img className="w-full h-full object-cover" src={post.image || postplaceholderImage} alt="" />
                    <div className="h-full md:h-36 flex flex-col bg-gradient-to-t from-black via-black/70 -translate-y-full p-4">
                        <div className="grow"></div>
                        <h1 className="text-2xl text-white font-bold">{post.title}</h1>
                        <p className="text-white text text-gray-100  md:mr-16 my-2">{truncate(post.description, 180)}</p>
                        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
                            <span className="text-gray-300 text-semibold text-sm"><span>Postado em: </span>{moment(post?.postedAt).format("DD/MM/YYYY hh:mm")}</span>
                            <Link to={`/usuario/${post.author.link}`} className="flex items-center gap-2">
                                <span className="h-6 w-6 flex items-center justify-center">
                                    {(function () {
                                        return post.author.profilePicture ?
                                            <img className="w-full h-full object-cotain rounded-full bg-gray-300" src={post.author.profilePicture} alt={post.author.username} />
                                            : <FaUser className="text-gray-100" />
                                    }())}
                                </span>
                                <span className="text-sm text-gray-100">{post.author.username}</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="my-4 grid lg:grid-cols-4 gap-4">
                    <div className="overflow-x-auto max-w-screen col-span-4 lg:col-span-3">
                        <div className="mb-4 bg-white rounded-lg sun-editor-editable" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                        <hr className="my-4" />
                        <div className="mx-4 my-4 flex flex-wrap gap-4">
                            <span className="text-gray-800 text-semibold text-sm"><span>Postado em: </span>{moment(post?.postedAt).format("DD/MM/YYYY hh:mm")}</span>
                            <span className="text-gray-800 text-semibold text-sm"><span>Editado em: </span>{moment(post?.modifiedAt).format("DD/MM/YYYY hh:mm")}</span>
                        </div>
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
        </Layout>
    )
}

export default Index