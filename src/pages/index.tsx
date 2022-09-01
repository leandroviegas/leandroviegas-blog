import React from "react";

import Layout from "../layouts/Layout"
import Head from "../components/Head";

import { FaGithub, FaLinkedinIn, FaGraduationCap } from "react-icons/fa";

import frontendImage from "../images/frontend.svg"
import backendImage from "../images/backend.svg"
import databaseImage from "../images/database.svg"
import toolsImage from "../images/tools.svg"

import developerperfilImage from "../images/developer_perfil.svg"
import leandroViegasVintage from "../images/leandro_viegas_vintage.png"
import perfilBackground from "../images/perfil_background.svg"

const Index = () => {
    return (
        <Layout>
            <svg width="0" height="0">
                <linearGradient id="svg-gradients" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop stopColor="#9233E9" offset="0%" />
                    <stop stopColor="#6366F1" offset="100%" />
                </linearGradient>
            </svg>
            <Head title="Bem vindo - Leandro Viegas" description="Sou desenvolvedor e trabalho com diversas tecnologias" />
            <section className="container mx-auto flex justify-center flex-wrap gap-6 my-24 items-center">
                <div className="mx-4 max-w-[580px] order-2 lg:order-1">
                    <h1 className="flex flex-col mt-2">
                        <span className="order-3 text-2xl text-zinc-800">Desenvolvedor Fullstack</span>
                        <span className="order-1 text-2xl font-semibold text-zinc-800 -mb-3">Eu sou</span>
                        <span style={{textShadow: "-3.5px -3.5px 0px #111111"}} className="order-2 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-snug">Leandro Viegas</span>
                    </h1>
                    <p className="text-xl font-thin text-zinc-600 mt-4">Muito mais do que uma paixão por aprender sobre tecnologia, sou focado em gerar resultado.</p>
                    <h2 className="text-md italic text-zinc-700 mt-2">“Resultado move o mundo!”</h2>
                    <hr className="mt-4 border-zinc-300" />
                    <div className="flex flex-wrap my-2 gap-2 justify-end text-lg">
                        <a target="_blink" className="hover:scale-125 transition hover:text-indigo-800" href="https://www.linkedin.com/in/l3androviegas">
                            <FaLinkedinIn />
                        </a>
                        <a target="_blink" className="hover:scale-125 transition hover:text-indigo-800" href="https://github.com/leandroviegas">
                            <FaGithub />
                        </a>
                    </div>
                    {/* <button className="bg-gradient-to-b from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 mt-3 text-white font-semibold text-sm hover:scale-110 transition-all hover:shadow-lg hover:shadow-indigo-600/50 rounded px-4 py-2">Mais sobre mim</button> */}
                </div>
                <div className="order-1">
                    <div className="max-w-[280px] relative mx-3">
                        
                        <img className="w-full rotate-6 position absolute bottom-0 drop-shadow-2xl" src={perfilBackground} alt="" />
                        <img style={{ borderRadius: "7.4rem" }} className="w-full relative z-10 grayscale hover:grayscale-[30%] transition-all hover:scale-110 ease-in delay-150" src={leandroViegasVintage} alt="" />                        
                    </div>
                </div>
            </section>
            <section>
                <div className="bg-gradient-to-b from-purple-600 to-indigo-600">
                    <div className="container mx-auto">
                        <h1 className="text-3xl drop-shadow-lg font-bold text-center text-white px-4 py-16">Tecnologias que eu utilizo</h1>
                    </div>
                </div>
                <div className="bg-indigo-600 h-32 w-full absolute">

                </div>
                <div className="mx-auto gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-8 container z-10 relative">
                    <div className="delay-150 lg:hover:scale-105 transition ease-in bg-white mx-2 md:mx-0 px-6 py-8 rounded-lg shadow-xl flex flex-col gap-3">
                        <img className="mx-auto h-40 my-4 max-w-screen" src={frontendImage} alt="frontend image" />
                        <h1 className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-500">Frontend</h1>
                        <div className="text-zinc-600 font-thin text-center">
                            {[[
                                "css",
                                "Javascript",
                                "typescript"
                            ],
                            ["Tailwindcss",
                                "Bootstrap"],
                            ["React.Js"]].map((items, index) =>
                                <div key={index} className="my-3">
                                    <hr className="my-3" />
                                    <div>
                                        {items.map(item =>
                                            <span key={item} className="inline-block border px-3 rounded-lg border-zinc-700 m-1 mx-2">{item}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="delay-150 lg:hover:scale-105 transition ease-in bg-white mx-2 md:mx-0 px-6 py-8 rounded-lg shadow-xl flex flex-col gap-3">
                        <img className="mx-auto h-40 my-4 max-w-screen" src={backendImage} alt="backend image" />
                        <h1 className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-500">Backend</h1>
                        <div className="text-zinc-600 font-thin text-center">
                            {[
                                [
                                    "Javascript",
                                    "Typescript"
                                ],
                                ["Express.js"],
                                ["Next.Js", "Gatsby"]
                            ].map((items, index) =>
                                <div key={index} className="my-3">
                                    <hr className="my-3" />
                                    <div>
                                        {items.map(item =>
                                            <span key={item} className="inline-block border px-3 rounded-lg border-zinc-700 m-1 mx-2">{item}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="delay-150 lg:hover:scale-105 transition ease-in col-span-full lg:col-span-1 bg-white mx-2 md:mx-0 px-6 py-8 rounded-lg shadow-xl flex flex-col gap-3">
                        <img className="mx-auto h-40 my-4 max-w-screen" src={databaseImage} alt="database image" />
                        <h1 className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-500">Banco de dados</h1>
                        <div className="text-zinc-600 font-thin text-center">
                            {[[
                                "MySql",
                                "SQL Server"
                            ],
                            ["MongoDB"]].map((items, index) =>
                                <div key={index} className="my-3">
                                    <hr className="my-3" />
                                    <div>
                                        {items.map(item =>
                                            <span key={item} className="inline-block border px-3 rounded-lg border-zinc-700 m-1 mx-2">{item}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div>
                    <div className="container mx-auto py-16">
                        <div className="flex justify-center flex-wrap items-center gap-6 mx-6">
                            <div className="mx-4 my-8 max-w-[580px] order-2 lg:order-1">
                                <h1 style={{textShadow: "-2.5px -2.5px 0px #333"}} className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Meus aprendizados</h1>
                                <p className="text-xl font-thin text-zinc-800 mt-4">Comecei aprendendo sobre programação em 2018 com 2 cursos técnicos da escola técnica estadual de São Paulo (ETEC). Desde então venho aprimorando minhas habilidades de várias formas, seja com conhecimento teórico em conteúdo pela internet ou na prática.</p>
                                <hr className="my-2" />
                                <h2 className="text-md italic text-zinc-700">“Conhecimento é o melhor investimento!”</h2>
                            </div>
                            <div className="order-1 mx-8">
                                <FaGraduationCap className="brightness-90 transition delay-150 ease-in hover:scale-110" style={{ stroke: "url(#svg-gradients)", fill: "url(#svg-gradients)" }} size={240} />
                            </div>
                        </div>
                    </div>
                </div>


            </section>
            <div className="bg-gradient-to-b from-purple-600 to-indigo-600 h-44 w-full absolute"></div>
            <div className="bg-zinc-100 container mx-auto my-16 py-16 z-10 relative border shadow-lg shadow-black/10 rounded-lg">

            </div>
        </Layout>
    )
}

export default Index