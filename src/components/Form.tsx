import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";

import moment from "moment";

import ReactTextareaAutosize from 'react-textarea-autosize';
import SunEditor from 'suneditor-react';
import Toggle from "react-toggle";
import Alert, { AlertProps } from "./Alert";
import '../css/suneditor-contents.min.css';
import '../css/suneditor.min.css';

import "react-toggle/style.css";

import { Category, Post } from "../types/blog.type";
import api from "../services/api";
import { VscLoading } from "react-icons/vsc";
import { useAuth } from "../Hooks/Auth";

const Index = ({ link }) => {
    const { cookies } = useAuth()

    const [content, setContent] = useState<string>("")

    const defaultForm = {
        title: "",
        description: "",
        keywords: "",
        image: "",
        content,
        link: "",
        category: "",
        author: "",
        active: true,
        modifiedAt: new Date(),
        postedAt: new Date(),
        readTime: 0,
    }

    const [form, setForm] = useState<Omit<Post, "category" | "author"> & { category: string, author: string }>(defaultForm);

    const [status, setStatus] = useState<"loading" | "success" | "error" | "">("")

    const [alerts, setAlerts] = useState<(AlertProps & { input: string })[]>([])

    const [categories, setCategories] = useState<{ status: "loading" | "success" | "error" | "", data: Category[] }>({ status: "", data: [] })

    const HandleLoadCategories = () => {
        if (categories.status === "loading") return;
        setCategories({ status: "loading", data: [] });

        api.get("/categories/list").then(resp => {
            setCategories({ status: "success", data: resp.data?.categories });
            setForm({ ...form, category: resp.data?.categories[0]._id })
        }).catch(err => {
            console.error(err)
            setCategories({ status: "error", data: [] });
            if (err.response.data?.message)
                setAlerts([{ type: "error", message: err.response.data.message, input: "form-post" }])
            else
                setAlerts([{ type: "error", message: "Ocorreu um erro ao carregar categorias!", input: "form-post" }])
        })
    }

    const HandleSendPost = () => {
        if (status === "loading") return;
        let alerts: (AlertProps & { input: string })[] = []

        if (!(form.title?.length > 5)) alerts.push({ type: "warning", message: "Título precisa ter mais do que 5 caracteres.", input: "form-post-title" })

        if (!(form.link?.length > 5)) alerts.push({ type: "warning", message: "Link precisa ter mais do que 5 caracteres.", input: "form-post-link" })

        if (!(form.category?.length > 0)) alerts.push({ type: "warning", message: "Você precisa selecionar uma categoria.", input: "form-post-category" })

        setAlerts(alerts)

        if (alerts.length === 0) {
            setStatus("loading");
            if (form?._id) {
                api.put("/posts", { ...form, content }, { headers: { authorization: `Bearer ${cookies.authentication}` } }).then(resp => {
                    navigate("/admin/postagens/listar")
                }).catch(err => {
                    console.error(err)
                    setStatus("error");
                    if (err.response.data?.message)
                        setAlerts([{ type: "error", message: err.response.data.message, input: "form-post" }])
                    else
                        setAlerts([{ type: "error", message: "Ocorreu um erro ao salvar alterações!", input: "form-post" }])
                })
            } else {
                api.post("/posts", { ...form, content }, { headers: { authorization: `Bearer ${cookies.authentication}` } }).then(resp => {
                    navigate("/admin/postagens/listar")
                }).catch(err => {
                    console.error(err)
                    setStatus("error");
                    if (err.response.data?.message)
                        setAlerts([{ type: "error", message: err.response.data.message, input: "form-post" }])
                    else
                        setAlerts([{ type: "error", message: "Ocorreu um erro ao postar!", input: "form-post" }])
                })
            }
        }
    }

    const HandleLoadPost = () => {
        if (status === "loading") return;
        setStatus("loading");

        api.get("/posts", { params: { link } }).then(resp => {
            setForm(resp.data?.post);
            setContent(resp.data?.post?.content)
            setStatus("success");
        }).catch(err => {
            console.error(err)
            setStatus("error");
            if (err.response.data?.message)
                setAlerts([{ type: "error", message: err.response.data.message, input: "form-post" }])
            else
                setAlerts([{ type: "error", message: "Ocorreu um erro ao carregar postagem!", input: "form-post" }])
        })
    }

    useEffect(() => {
        HandleLoadCategories()
    }, [])

    useEffect(() => {

        if (link) {
            HandleLoadPost()
        } else {
            setStatus("loading")
            setForm(defaultForm)
            setContent("")
            setTimeout(() => { setStatus("success") }, 50);
        }
    }, [link])

    return (
        <div className="bg-white rounded-lg shadow-lg shadow-black-50/10">

            <div className="flex items-center p-4 pb-2 rounded-t-lg text-indigo-800 justify-between">
                <h1 className="text-xl font-semibold">Nova postagem</h1>
                <div className="flex items-center my-2">
                    <label htmlFor="active" className="rounded-t-xl text-zinc-500 font-semibold mx-2">Ativo:</label>
                    <Toggle defaultChecked={form.active} onChange={value => setForm({ ...form, active: value.currentTarget.checked })} name="active" className="text-sky-700" />
                </div>
            </div>
            <hr className="mx-4" />
            {alerts.filter(alert => alert.input === "form-post").length > 0 &&
                (<div className="p-2 px-4">
                    {alerts.filter(alert => alert.input === "form-post").map(alert => <Alert key={alert.message} message={alert.message} type={alert.type} />)}
                </div>)}
            <div className="py-2 p-4">
                {status === "loading" &&
                    <div className="flex justify-center my-8">
                        <VscLoading className="text-5xl animate-spin text-indigo-800" />
                    </div>}
                {status !== "loading" &&
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="border-r px-3">
                            {
                                (function (form, setForm) {
                                    let errors = alerts.filter(alert => alert.input === "form-post-title");
                                    return (
                                        <div className="w-full my-2">
                                            <label htmlFor="title" className="rounded-t-xl text-zinc-500 font-semibold">Título da postagem:</label>
                                            <input defaultValue={form.title} onChange={evt => setForm({ ...form, title: evt.currentTarget.value })} type="text" name="title" className={`${errors.length > 0 ? "border-yellow-600 text-yellow-600 placeholder-yellow-600/60" : "text-gray-500"} outline-none transition border rounded w-full px-2 mt-1 py-0.5`} placeholder="Digite o título da postagem" />
                                            {errors.map(alert => <div className="my-2">
                                                <Alert key={alert.message} message={alert.message} type={alert.type} />
                                            </div>)}
                                        </div>)
                                }(form, setForm))
                            }
                            {
                                (function (form, setForm) {
                                    let errors = alerts.filter(alert => alert.input === "form-post-link");
                                    return (
                                        <div className="w-full my-2">
                                            <label htmlFor="link" className="rounded-t-xl text-zinc-500 font-semibold">Link da postagem:</label>
                                            <input defaultValue={form.link} onChange={evt => setForm({ ...form, link: evt.currentTarget.value })} type="text" name="link" className={`${errors.length > 0 ? "border-yellow-600 text-yellow-600 placeholder-yellow-600/60" : "text-gray-500"} outline-none transition border rounded w-full px-2 mt-1 py-0.5`} placeholder="Digite o link da postagem" />
                                            {errors.map(alert => <div className="my-2">
                                                <Alert key={alert.message} message={alert.message} type={alert.type} />
                                            </div>)}
                                        </div>)
                                }(form, setForm))
                            }
                            <div className="w-full my-4">
                                {["success", "error"].includes(status) &&
                                    <SunEditor defaultValue={content} onChange={setContent} setOptions={{
                                        buttonList: [
                                            // default
                                            ['undo', 'redo'],
                                            [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                                            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                                            ['fontColor', 'hiliteColor', 'textStyle'],
                                            ['removeFormat'],
                                            ['outdent', 'indent'],
                                            ['align', 'horizontalRule', 'list', 'lineHeight'],
                                            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview'],
                                            ['-right', ':r-More Rich-default.more_plus', 'table', 'imageGallery'],
                                            ['-right', 'image', 'video', 'audio', 'link'],
                                            // (min-width: 992)
                                            ['%992', [
                                                ['undo', 'redo'],
                                                [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                                                ['bold', 'underline', 'italic', 'strike'],
                                                [':t-More Text-default.more_text', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
                                                ['removeFormat'],
                                                ['outdent', 'indent'],
                                                ['align', 'horizontalRule', 'list', 'lineHeight'],
                                                ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview'],
                                                ['-right', ':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'imageGallery']
                                            ]],
                                            // (min-width: 767)
                                            ['%767', [
                                                ['undo', 'redo'],
                                                [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                                                [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
                                                ['removeFormat'],
                                                ['outdent', 'indent'],
                                                [':e-More Line-default.more_horizontal', 'align', 'horizontalRule', 'list', 'lineHeight'],
                                                [':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'imageGallery'],
                                                ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview']
                                            ]],
                                            // (min-width: 480)
                                            ['%480', [
                                                ['undo', 'redo'],
                                                [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                                                [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
                                                [':e-More Line-default.more_horizontal', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'lineHeight'],
                                                [':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'imageGallery'],
                                                ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview']
                                            ]]
                                        ],
                                        defaultStyle: `font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; text-size: 14px;`,
                                    }} lang="pt_br" />}
                            </div>
                        </div>
                        <div className="px-3">
                            <div className="w-full flex gap-2">
                                {
                                    (function (form, setForm) {
                                        let errors = alerts.filter(alert => alert.input === "form-post-readTime");
                                        return (
                                            <div className="my-2 basis-1/2">
                                                <label htmlFor="readTime" className="rounded-t-xl text-zinc-500 font-semibold w-full">Tempo de leitura (minutos):</label><br />
                                                <input defaultValue={form.readTime} onChange={evt => setForm({ ...form, readTime: Number(evt.currentTarget.value) })} type="number" name="readTime" className={`${errors.length > 0 ? "border-yellow-600 text-yellow-600 placeholder-yellow-600/60" : "text-gray-500"} outline-none transition border rounded w-40 px-2 mt-1 py-0.5`} placeholder="Tempo de leitura" />
                                                {errors.map(alert => <div className="my-2">
                                                    <Alert key={alert.message} message={alert.message} type={alert.type} />
                                                </div>)}
                                            </div>)
                                    }(form, setForm))
                                }
                                {
                                    (function (form, setForm) {
                                        let errors = alerts.filter(alert => alert.input === "form-post-category");
                                        return (
                                            <div className="my-2">
                                                <label htmlFor="category" className="rounded-t-xl text-zinc-500 font-semibold w-full">Categoria:</label><br />
                                                <select defaultValue={form.category} onChange={evt => setForm({ ...form, category: evt.currentTarget.value })} name="category" className={`${errors.length > 0 ? "border-yellow-600 text-yellow-600 placeholder-yellow-600/60" : "text-gray-500"} outline-none transition border rounded w-full px-2 mt-1 py-0.5`}>
                                                    {categories.data.map(category => <option key={category._id} value={category._id}>{category.name}</option>)}
                                                </select>
                                                {errors.map(alert => <div className="my-2">
                                                    <Alert key={alert.message} message={alert.message} type={alert.type} />
                                                </div>)}
                                            </div>)
                                    }(form, setForm))
                                }
                            </div>
                            <div className="w-full flex flex-col sm:flex-row gap-2">
                                {
                                    (function (form, setForm) {
                                        let errors = alerts.filter(alert => alert.input === "form-post-postedAt");
                                        return (
                                            <div className="my-2 basis-1/2">
                                                <label htmlFor="postedAt" className="rounded-t-xl text-zinc-500 font-semibold w-full">{true ? "Postar" : "Postado"} em:</label><br />
                                                <input defaultValue={moment(form.postedAt).format("YYYY-MM-DDThh:mm")} onChange={evt => setForm({ ...form, postedAt: new Date(evt.currentTarget.value) })} type="datetime-local" name="postedAt" className={`${errors.length > 0 ? "border-yellow-600 text-yellow-600 placeholder-yellow-600/60" : "text-gray-500"} outline-none transition border rounded w-full px-2 mt-1 py-0.5`} />
                                                {errors.map(alert => <div className="my-2">
                                                    <Alert key={alert.message} message={alert.message} type={alert.type} />
                                                </div>)}
                                            </div>)
                                    }(form, setForm))
                                }
                                {
                                    (function (form, setForm) {
                                        let errors = alerts.filter(alert => alert.input === "form-post-editedAt");
                                        return (
                                            <div className="my-2 basis-1/2">
                                                <label htmlFor="editedAt" className="rounded-t-xl text-zinc-500 font-semibold w-full">Editado em:</label><br />
                                                <input defaultValue={moment(form.postedAt).format("YYYY-MM-DDThh:mm")} onChange={evt => setForm({ ...form, postedAt: new Date(evt.currentTarget.value) })} type="datetime-local" name="editedAt" className={`${errors.length > 0 ? "border-yellow-600 text-yellow-600 placeholder-yellow-600/60" : "text-gray-500"} outline-none transition border rounded w-full px-2 mt-1 py-0.5`} />
                                                {errors.map(alert => <div className="my-2">
                                                    <Alert key={alert.message} message={alert.message} type={alert.type} />
                                                </div>)}
                                            </div>)
                                    }(form, setForm))
                                }
                            </div>
                            {
                                (function (form, setForm) {
                                    let errors = alerts.filter(alert => alert.input === "form-post-keywords");
                                    return (
                                        <div className="w-full my-2">
                                            <label htmlFor="keywords" className="rounded-t-xl text-zinc-500 font-semibold">Palavras chaves:</label>
                                            <ReactTextareaAutosize defaultValue={form.keywords} onChange={evt => setForm({ ...form, keywords: evt.currentTarget.value })} name="keywords" minRows={2} className={`${errors.length > 0 ? "border-yellow-600 text-yellow-600 placeholder-yellow-600/60" : "text-gray-500"} outline-none transition border rounded w-full px-2 mt-1 py-0.5`} placeholder="Digite as palavras chaves" />
                                            {errors.map(alert => <div className="my-2">
                                                <Alert key={alert.message} message={alert.message} type={alert.type} />
                                            </div>)}
                                        </div>)
                                }(form, setForm))
                            }
                            {
                                (function (form, setForm) {
                                    let errors = alerts.filter(alert => alert.input === "form-post-description");
                                    return (
                                        <div className="w-full my-2">
                                            <label htmlFor="description" className="rounded-t-xl text-zinc-500 font-semibold">Descrição:</label>
                                            <ReactTextareaAutosize defaultValue={form.description} onChange={evt => setForm({ ...form, description: evt.currentTarget.value })} name="description" minRows={2} className={`${errors.length > 0 ? "border-yellow-600 text-yellow-600 placeholder-yellow-600/60" : "text-gray-500"} outline-none transition border rounded w-full px-2 mt-1 py-0.5`} placeholder="Digite a descrição da postagem" />
                                            {errors.map(alert => <div className="my-2">
                                                <Alert key={alert.message} message={alert.message} type={alert.type} />
                                            </div>)}
                                        </div>)
                                }(form, setForm))
                            }
                        </div>
                    </div>}
                <hr className="my-2" />
                <div className="py-2">
                    <button onClick={HandleSendPost} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-800 text-white transition font-semibold" type="submit">
                        {status === "loading" ? <VscLoading className="animate-spin text-lg mx-6 my-0.5" /> : form?._id ? "Editar publicação" : "Publicar"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Index