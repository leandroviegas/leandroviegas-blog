import React from "react";

import Layout from "../layouts/Layout"
import Head from "../components/Head";

import { ImLinkedin } from "react-icons/im"

import frontendImage from "../images/frontend.svg"
import backendImage from "../images/backend.svg"
import databaseImage from "../images/database.svg"
import toolsImage from "../images/tools.svg"
import developerperfilImage from "../images/developer_perfil.svg"
import leandroViegasVintage from "../images/leandro_viegas_vintage.png"
import perfilBackground from "../images/perfil_background.svg"
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

const Index = () => {
    return (
        <Layout>
            <Head title="Bem vindo - Leandro Viegas" description="Sou desenvolvedor e trabalho com diversas tecnologias" />
            <section className="container mx-auto flex justify-center flex-wrap gap-6 my-24 items-center">
                <div className="mx-4 max-w-[580px] order-2 lg:order-1">
                    <h1 className="flex flex-col mt-2">
                        <span className="text-2xl text-zinc-800 order-3">Desenvolvedor Fullstack</span>
                        <span className="text-2xl font-semibold text-zinc-800 order-1 -mb-3">Eu sou</span>
                        <span className="text-5xl font-bold text-transparent order-2 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-snug">Leandro Viegas</span>
                    </h1>
                    <p className="text-xl font-thin text-zinc-600 mt-4">Muito mais do que uma paixão por aprender sobre tecnologia, sou focado em gerar resultado.</p>
                    <h2 className="text-xl text-zinc-700 mt-2">Resultado move o mundo!</h2>
                    <hr className="mt-4 border-zinc-300" />
                    <div className="flex flex-wrap my-2 text-xl gap-2 justify-end text-lg text-indigo-600">
                        <a target="_blink" className="hover:scale-125 transition hover:text-indigo-800" href="https://www.linkedin.com/in/l3androviegas">
                            <FaLinkedinIn />
                        </a>

                        <a target="_blink" className="hover:scale-125 transition hover:text-indigo-800" href="https://github.com/leandroviegas">
                            <FaGithub />
                        </a>
                    </div>
                    <button className="bg-indigo-700 mt-3 text-white font-semibold text-sm hover:scale-110 transition hover:shadow-lg hover:shadow-indigo-600/50 rounded px-4 py-2">Mais sobre mim</button>
                </div>
                <div className="order-1">
                    <div className="max-w-[280px] relative mx-3">
                        <img className="w-full rotate-6 position absolute bottom-0" src={perfilBackground} alt="" />
                        <img style={{ borderRadius: "7.4rem" }} className="w-full relative z-10 grayscale hover:grayscale-[50%] transition-all hover:scale-110 ease-in delay-150" src={leandroViegasVintage} alt="" />
                    </div>
                </div>
            </section>
            <section>
                <div className="bg-gradient-to-b from-purple-500 to-indigo-600">
                    <div className="container mx-auto">
                        <h1 className="text-3xl font-bold text-center text-white px-4 py-16">Tecnologias que eu utilizo</h1>
                    </div>
                </div>
                <div className="bg-indigo-600 h-32 w-full absolute">

                </div>
                <div className="mx-auto gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-8 container z-10 relative">
                    <div className="bg-white mx-2 md:mx-0 p-4 pt-8 rounded-lg shadow-xl flex flex-col gap-3">
                        <img className="mx-auto h-40 max-w-screen" src={frontendImage} alt="frontend image" />
                        <h1 className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Frontend</h1>
                        <hr />
                        <div className="text-zinc-600 mt-2 font-thin text-center">
                            {[
                                "css",
                                "Javascript",
                                "Tailwindcss",
                                "Bootstrap",
                                "React.Js"
                            ].map(item => <span key={item} className="inline-block border px-3 rounded-lg border-zinc-700 m-1 mx-2">{item}</span>)}
                        </div>
                    </div>

                    <div className="bg-white mx-2 md:mx-0 p-4 pt-8 rounded-lg shadow-xl flex flex-col gap-4">
                        <img className="mx-auto h-40 max-w-screen" src={backendImage} alt="backend image" />
                        <h1 className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Backend</h1>
                        <hr />
                        <div className="text-zinc-600 mt-2 font-thin text-center">
                            {[
                                "Express.js",
                                "Javascript",
                                "Typescript",
                                "Next.js"
                            ].map(item => <span key={item} className="inline-block border px-3 rounded-lg border-zinc-700 m-1 mx-2">{item}</span>)}
                        </div>
                    </div>

                    <div className="col-span-full lg:col-span-1 bg-white mx-2 md:mx-0 p-4 pt-8 rounded-lg shadow-xl flex flex-col gap-4">
                        <img className="mx-auto h-40 max-w-screen" src={databaseImage} alt="database image" />
                        <h1 className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Banco de dados</h1>
                        <hr />
                        <div className="text-zinc-600 mt-2 font-thin text-center">
                            {[
                                "MongoDB",
                                "MySql",
                                "SQL Server"
                            ].map(item => <span key={item} className="inline-block border px-3 rounded-lg border-zinc-700 m-1 mx-2">{item}</span>)}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Index