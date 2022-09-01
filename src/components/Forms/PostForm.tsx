import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";

import moment from "moment";

import SunEditor from 'suneditor-react';
import Toggle from "./Inputs/Toggle";
import Alert from "../Alert";

import api from "../../services/api";
import linkfy from "../../utils/linkfy";
import { useAuth } from "../../hooks/Auth";

import '../../css/suneditor-contents.min.css';
import '../../css/suneditor.min.css';

import { Topic, Post } from "../../types/blog.type";

import { VscLoading } from "react-icons/vsc";
import FloatingLabelInput from "./Inputs/FloatingLabelInput";

const PostForm = (post: Omit<Post, "topics" | "author"> & { topics: string[], author: string }) => {
    const { cookies } = useAuth()

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const [content, setContent] = useState(post.content)

    const [form, setForm] = useState(post);

    const [formStatus, setFormStatus] = useState<"loading" | "success" | "error" | "input-warnings" | "">("")

    const [topics, setTopics] = useState<{ status: "loading" | "success" | "error" | "", data: Topic[] }>({ status: "", data: [] })

    const HandleSendPost = async (evt?: React.FormEvent<HTMLFormElement>) => {
        evt?.preventDefault && evt.preventDefault()

        if (status === "loading") return;

        if (["post-form-title", "post-form-link"].some(input => alerts[input].length > 0)) {
            setFormStatus("input-warnings");
        } else {
            setFormStatus("loading");

            try {
                const headers = { authorization: `Bearer ${cookies.authentication}` }
                if (form?._id) {
                    await api.put("/posts", { ...form, content }, { headers })
                } else {
                    await api.post("/posts", { ...form, content }, { headers })
                }

                navigate("/admin/posts/list")
            } catch (err) {
                setFormStatus("error");
                setAlerts({ ...alerts, "post-form": [err?.response?.data?.message || `Ocorreu um erro ao ${form?._id ? "editar" : "adicionar"} postagem.`] })
            }
        }
    }

    const HandleLoadTopics = async () => {
        await api.get("/topics/list").then(resp => {
            setTopics({ status: "success", data: resp.data?.topics });
            setForm(f => ({ ...f, topics: f.topics && [ resp.data?.topics?.map(topic => topic?._id)[0] ] }))
        }).catch(err => {
            console.error(err)
            setTopics({ status: "error", data: [] });
            setAlerts({ ...alerts, "post-form": [err?.response?.data?.message || `Ocorreu um erro ao carregar tópicos.`] })
        })
    }

    useEffect(() => {
        if (!(form.title.length > 0))
            setAlerts(a => ({ ...a, "post-form-title": [`Nome é obrigatório`] }))
        else if (!(form.title.length > 3))
            setAlerts(a => ({ ...a, "post-form-title": [`Nome deve ter no mínimo 3 caracteres`] }))
        else
            setAlerts(a => ({ ...a, "post-form-title": [] }))

        if (!(form.link.length > 0))
            setAlerts(a => ({ ...a, "post-form-link": [`Link é obrigatório`] }))
        else if (!(form.link.length > 3))
            setAlerts(a => ({ ...a, "post-form-link": [`Link deve ter no mínimo 3 caracteres`] }))
        else if (form.link.endsWith("-"))
            setAlerts(a => ({ ...a, "post-form-link": [`Link não pode terminar em "-"`] }))
        else
            setAlerts(a => ({ ...a, "post-form-link": [] }))
    }, [form])

    useEffect(() => {
        HandleLoadTopics()
    }, [])

    return (
        <div className="bg-white rounded-lg shadow-lg shadow-black-50/10">
            <div className="flex items-center px-4 py-2 rounded-t-lg bg-gradient-to-r from-violet-700 to-indigo-600 text-white justify-between">
                <h1 className="text-xl font-bold">Nova postagem</h1>
                <div className="flex items-center my-2">
                    <label htmlFor="active" className="rounded-t-xl font-semibold mx-2">Ativo</label>
                    <Toggle defaultChecked={form.active} onChange={value => setForm({ ...form, active: value.target.checked })} name="active" />
                </div>
            </div>
            {alerts["post-form"]?.map((message, index) => <Alert key={index} message={message} type="error" />)}
            <div className="py-2 p-4">
                {formStatus === "loading" &&
                    <div className="flex justify-center my-44">
                        <VscLoading className="text-5xl animate-spin text-indigo-800" />
                    </div>}
                {formStatus !== "loading" &&
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="lg:border-r px-3">
                            <form onSubmit={HandleSendPost}>
                                <div className="w-full my-5">
                                    <FloatingLabelInput label="Título" name="title" defaultValue={form.title} onChange={evt => setForm({ ...form, title: evt.target.value, link: linkfy(evt.target.value) })} status={(formStatus === "input-warnings" && alerts["post-form-title"]?.length > 0) ? "error" : "info"} messages={alerts["post-form-title"]} />
                                </div>

                                <div className="w-full my-5">
                                    <FloatingLabelInput label="Link da postagem" name="link" value={form.link} onChange={evt => setForm({ ...form, link: linkfy(evt.target.value) })} status={(formStatus === "input-warnings" && alerts["post-form-link"]?.length > 0) ? "error" : "info"} messages={alerts["post-form-link"]} />
                                </div>
                            </form>
                            <div className="w-full my-5">
                                <SunEditor height="600" defaultValue={content} onChange={setContent} setOptions={{
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
                                }} lang="pt_br" />
                            </div>
                        </div>
                        <div className="px-3">
                            <form onSubmit={HandleSendPost}>
                                <div className="w-full flex gap-1 md:gap-2 lg:gap-4 flex-wrap">

                                    <div className="my-5 min-w-[192px]">
                                        <FloatingLabelInput label="Tempo de leitura (minutos)" type="number" name="readTime" defaultValue={form.readTime} onChange={evt => setForm({ ...form, readTime: Number(evt.target.value) })} status={(formStatus === "input-warnings" && alerts["post-form-readTime"]?.length > 0) ? "error" : "info"} messages={alerts["post-form-readTime"]} />
                                    </div>

                                    <div className="my-5">
                                        <FloatingLabelInput type="select" label="Tópicos" name="topic" onChange={evt => setForm({ ...form, topics: [evt.currentTarget.value] })} status={(formStatus === "input-warnings" && alerts["post-form-topics"]?.length > 0) ? "error" : "info"} messages={alerts["post-form-topics"]} >
                                            {topics.data.map(topic => <option key={topic._id} value={topic._id}>{topic.name}</option>)}
                                        </FloatingLabelInput>
                                    </div>
                                </div>

                                <div className="w-full flex flex-col flex-wrap sm:flex-row gap-1 md:gap-2 lg:gap-4">
                                    <div className="my-5">
                                        <FloatingLabelInput label={`${true ? "Postar" : "Postado"} em`} type="datetime-local" name="postedAt" defaultValue={moment(form.postedAt).format("YYYY-MM-DDThh:mm")} onChange={evt => setForm({ ...form, postedAt: new Date(evt.target.value) })} status={(formStatus === "input-warnings" && alerts["post-form-postedAt"]?.length > 0) ? "error" : "info"} messages={alerts["post-form-postedAt"]} />
                                    </div>
                                    <div className="my-5">
                                        <FloatingLabelInput label="Editado em" type="datetime-local" name="modifiedAt" defaultValue={moment(form.modifiedAt).format("YYYY-MM-DDThh:mm")} onChange={evt => setForm({ ...form, modifiedAt: new Date(evt.target.value) })} status={(formStatus === "input-warnings" && alerts["post-form-modifiedAt"]?.length > 0) ? "error" : "info"} messages={alerts["post-form-modifiedAt"]} />
                                    </div>
                                </div>

                                <div className="w-full my-5">
                                    <FloatingLabelInput label="Palavras chaves" type="textarea" name="keywords" defaultValue={form.keywords} onChange={evt => setForm({ ...form, keywords: evt.target.value })} status={(formStatus === "input-warnings" && alerts["post-form-keywords"]?.length > 0) ? "error" : "info"} messages={alerts["post-form-keywords"]} />
                                </div>

                                <div className="w-full my-5">
                                    <FloatingLabelInput label="Descrição" type="textarea" name="description" defaultValue={form.description} onChange={evt => setForm({ ...form, description: evt.target.value })} status={(formStatus === "input-warnings" && alerts["post-form-description"]?.length > 0) ? "error" : "info"} messages={alerts["post-form-description"]} />
                                </div>
                                <input type="submit" className="hidden" />
                            </form>
                        </div>
                    </div>}
                <hr className="my-2" />
                <div className="py-2">
                    <button onClick={() => HandleSendPost()} className="shadow-lg shadow-violet-500/30 hover:scale-110 bg-violet-700 hover:bg-violet-800 transition font-semibold text-white px-3 py-1 rounded">
                        {status === "loading" ? <VscLoading className="animate-spin text-lg mx-6 my-0.5" /> : form?._id ? "Salvar alterações" : "Publicar"}
                    </button>
                </div>
            </div>
        </div>
    )
}


PostForm.defaultProps = {
    title: ``,
    description: ``,
    keywords: ``,
    image: ``,
    content: ``,
    link: ``,
    topics: [],
    author: ``,
    active: true,
    modifiedAt: new Date(),
    postedAt: new Date(),
    readTime: 0
}

export default PostForm