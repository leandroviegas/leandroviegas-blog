import React from "react";

import Layout from "@layouts/UserLayout"
import Head from "@components/Head";

import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import leandroViegasVintage from "@images/leandro_viegas_vintage.png"
import perfilBackground from "@images/perfil_background.svg"

const Index = () => {

    return (
        <Layout>
            <Head title="Bem vindo - Leandro Viegas" description="Sou desenvolvedor e trabalho com diversas tecnologias" />
            <section className="container mx-auto flex justify-center flex-wrap gap-6 my-32 items-center">
                <div className="mx-4 max-w-[580px] order-2 lg:order-1">
                    <h1 className="flex flex-col mt-2">
                        <span className="order-3 text-2xl text-zinc-800">Desenvolvedor Fullstack</span>
                        <span className="order-1 text-2xl font-semibold text-zinc-800 -mb-3">Eu sou</span>
                        <span style={{ textShadow: "-3.5px -3.5px 0px #111111" }} className="order-2 text-5xl font-bold text-transparent bg-clip-text bg-violet-700 leading-snug">Leandro Viegas</span>
                    </h1>
                    <p className="text-xl font-thin text-zinc-600 mt-4">Muito mais do que uma paixão por aprender sobre tecnologia, sou focado em gerar resultado.</p>
                    <h2 className="text-md italic text-zinc-700 mt-2">“Resultado move o mundo!”</h2>
                    <hr className="mt-4 border-zinc-300" />
                    <div className="flex flex-wrap gap-2 text-lg my-2 text-zinc-700 justify-end">
                        <a target="_blink" className="hover:scale-125 transition hover:text-indigo-800" href="https://www.linkedin.com/in/l3androviegas">
                            <FaLinkedinIn />
                        </a>
                        <a target="_blink" className="hover:scale-125 transition hover:text-indigo-800" href="https://github.com/leandroviegas">
                            <FaGithub />
                        </a>
                    </div>
                </div>
                <div className="order-1">
                    <div className="max-w-[280px] relative mx-3">
                        <img className="w-full rotate-6 position absolute bottom-0 drop-shadow-2xl" src={perfilBackground} alt="" />
                        <img style={{ borderRadius: "7.4rem" }} className="w-full relative z-10 grayscale hover:grayscale-[30%] transition-all hover:scale-110 ease-in delay-150" src={leandroViegasVintage} alt="" />
                    </div>
                </div>
            </section>

        </Layout>
    )
}

export default Index