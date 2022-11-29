import React from "react";

import Layout from "../layouts/UserLayout"
import Head from "../components/Head";

import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import leandroViegasVintage from "../images/leandro_viegas_vintage.png"
import perfilBackground from "../images/perfil_background.svg"
import layeredWaves from "../images/layered-waves-haikei.svg"

const Index = () => {
    return (
        <Layout>
            <Head title="Bem vindo - Leandro Viegas" description="Sou desenvolvedor e trabalho com diversas tecnologias" />
            <header>
                <div style={{ backgroundColor: "#693cdf" }}>
                    <div className="container mx-auto py-16 px-4">
                        <h1 className="text-2xl uppercase text-white font-bold text-center">Diferenciais</h1>
                        <p className="text-violet-100 text-xl max-w-2xl font-semibold mx-auto text-center m-3">É nos detalhes que se encontra o diferencial</p>
                        <p className="text-violet-200 text-lg max-w-2xl text-center mx-auto m-4">Um bom projeto é aquele que entrega bons resultados para o negócio. Por isso, o foco é gerar resultado baseado na necessidade do negócio, seja essa necessidade trazer vendas, visibilidade ou funcionalidades.</p>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 px-8 pt-12">
                            <div className="bg-white p-5 text-center multiple-shadow-white">
                                <h2 className="text-gray-700 text-2xl font-semibold">Mecanismo de Busca</h2>
                                <p className="text-gray-600 pt-3">Utilização de técnicas de SEO para melhorar no ranking de buscadores como o Google.</p>
                            </div>
                            <div className="bg-white p-5 text-center multiple-shadow-white">
                                <h2 className="text-gray-700 text-2xl font-semibold">Objetivos Claros</h2>
                                <p className="text-gray-600 pt-3">O propósito da criação de um projeto é muito importante e também será levado em conta.</p>
                            </div>
                            <div className="bg-white p-5 text-center multiple-shadow-white">
                                <h2 className="text-gray-700 text-2xl font-semibold">Responsividade</h2>
                                <p className="text-gray-600 pt-3">A compatilibidade com os diversos dispositivos é essêncial para uma melhor experiência de usuário.</p>
                            </div>
                            <div className="bg-white p-5 text-center multiple-shadow-white">
                                <h2 className="text-gray-700 text-2xl font-semibold">Funcionalidade</h2>
                                <p className="text-gray-600 pt-3">A funcionalidade do projeto também tem grande valor. Será trabalhado o visual, velocidade e resolução de bugs.</p>
                            </div>
                            <div className="bg-white p-5 text-center multiple-shadow-white">
                                <h2 className="text-gray-700 text-2xl font-semibold">Facilidade de Uso</h2>
                                <p className="text-gray-600 pt-3">Os projetos também desenvolvido pensando na praticidade de uso, utilizando de estruturas e design intuitivos.</p>
                            </div>
                            <div className="rounded bg-white p-5 text-center multiple-shadow-white">
                                <h2 className="text-gray-700 text-2xl font-semibold">Segurança</h2>
                                <p className="text-gray-600 pt-3">Segurança é essêncial, ninguém varia querer acessar um site com nível de segurança baixo ou até que pareça suspeito.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <img className="w-full select-none rotate-180 -mt-2" unselectable="on" src={layeredWaves} alt="" />
            </header>
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
                    <div className="flex flex-wrap my-2 text-zinc-700 gap-2 justify-end text-lg">
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

        </Layout>
    )
}

export default Index