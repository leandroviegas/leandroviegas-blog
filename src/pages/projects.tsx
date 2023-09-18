import React, { useEffect, useState } from "react";

import Layout from "@layouts/UserLayout"

import Head from "@components/Head"
import OpaqueBackground from "@components/OpaqueBackground";

import RegisterFormThumbnail from "@images/projects_thumbnail/register-form.png"
import { GrClose } from "react-icons/gr";
import { BiSquare } from "react-icons/bi";

const WorkPopup = ({ open, closeCallback, children }: { open: boolean, closeCallback: () => any, children: any }) => {
    return (
        <OpaqueBackground open={open} closeCallback={closeCallback}>
            <div data-aos="fade-down" className="top-0 md:top-4 absolute md:h-auto mx-auto min-h-screen sm:min-h-0 bg-white sm:rounded-lg max-w-screen max-w-[800px] w-full shadow">
                <button onClick={closeCallback} className="absolute top-3 right-3 px-2 py-2 bg-white rounded-full shadow-lg border"><GrClose /></button>
                {children}
            </div>
        </OpaqueBackground>
    )
}

const Index = () => {
    const [popup, setPopup] = useState<string>("")

    return (
        <Layout>
            <Head title="Sobre mim - Leandro Viegas" description="Sou desenvolvedor e trabalho com diversas tecnologias" />

            <div className="container grid grid-cols-1 m-auto mx-auto">
                <div className="px-4 md:px-8 bg-white m-6 rounded">
                    <section className="my-12">
                        <h1 className="text-2xl mx-2 font-semibold text-zinc-900">Projetos</h1>
                        <hr className="my-2 border-gray-800" />
                        <div className="md:my-6 mx-2">
                            <p className="text-md font-thin">A aplicação de aprendizados no mundo real é a etapa mais importante na jornada de um desenvolvedor.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 pt-4 md:pt-0">


                            {/* register-react-form */}
                            <div className="sm:col-span-3 lg:col-span-2">
                                <div>
                                    <img src={RegisterFormThumbnail} alt="Thumbnail projeto formulário de registro react" />
                                    <div className="shadow-lg border rounded-b-lg p-4">
                                        <h2 className="text-xl text-zinc-700 font-bold">Formulário de cadastro - react</h2>
                                        <p className="py-2">Formulário de cadastro com validação de campos feito em reactJS.</p>
                                        <div className="my-1">
                                            <a className="inline-flex items-center gap-1 text-xs text-white bg-black px-2 py-1 rounded" href="https://codesandbox.io/s/formulario-cadastro-de-usuario-pd50z8" target="_blank">
                                                <BiSquare /><span>CodeSandbox</span>
                                            </a>
                                        </div>
                                        <div className="pb-2">
                                            <hr className="my-4" />
                                            <button onClick={() => setPopup("register-react-form")} className="shrink-0 text-white bg-purple-700 hover:bg-purple-800 rounded py-1 px-3 font-semibold">Mais sobre o projeto</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <WorkPopup open={popup === "register-react-form"} closeCallback={() => setPopup("")}>
                                <section className="m-5 mb-6">
                                    <img src={RegisterFormThumbnail} alt="Thumbnail projeto formulário de registro react" />
                                    <div className="mt-4 px-4 pt-4">
                                        <a className="inline-flex items-center gap-1 text-xs text-white bg-black px-2 py-1 rounded  " href="https://codesandbox.io/s/formulario-cadastro-de-usuario-pd50z8" target="_blank">
                                            <BiSquare /><span>CodeSandbox</span>
                                        </a>
                                        <div className="my-4">
                                            <h2 className="font-semibold text-xl">Sobre</h2>
                                            <hr className="my-2 border-gray-800" />
                                            <p className="text-zinc-700">Formulário de cadastro com validação de campos feito em reactJS sem uso de biblioteca de gerenciamento de formulário.</p>
                                        </div>
                                        <div className="my-4">
                                            <h2 className="font-semibold text-lg">Tecnologias Utilizadas</h2>
                                            <hr className="my-2 border-gray-800" />
                                            <ul className="list-disc pl-4 text-zinc-700">
                                                <li>React JS</li>
                                            </ul>
                                        </div>
                                        <div className="my-4">
                                            <h2 className="font-semibold text-lg">Bibliotecas Utilizadas</h2>
                                            <hr className="my-2 border-gray-800" />
                                            <ul className="list-disc pl-4 text-zinc-700">
                                                <li>Styled-Components</li>
                                                <li>MUI components</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </WorkPopup>


                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    )
}

export default Index