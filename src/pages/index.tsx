import React from "react";

import Layout from "../layouts/Layout"

import frontendImage from "../images/frontend.svg"
import backendImage from "../images/backend.svg"
import databaseImage from "../images/backend.svg"
import toolsImage from "../images/tools.svg"

import developerperfilImage from "../images/developer_perfil.svg"

const Index = () => {
    return (
        <Layout>
            <div className="text-center flex flex-col gap-8 py-24">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-4xl font-bold text-zinc-800">Desenvolvedor fullstack</h1>
                    <h2 className="text-base md:text-lg font-thin text-zinc-700">Leandro A Viegas</h2>
                    <p className="text-lg md:text-2xl font-thin">“Desenvolvendo para melhorar o trabalho de outras pessoas”</p>
                </div>
                <img className="w-64 max-w-screen p-2 mx-auto" src={developerperfilImage} alt="developer image" />
            </div>
            <div className="bg-gradient-to-b from-indigo-600 to-purple-700">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold text-center text-white px-4 py-8">Tecnologias que eu utilizo</h1>
                </div>
            </div>
            <div className="bg-purple-700 h-32 w-full absolute">

            </div>
            <div className="mx-auto gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-8 container z-10 relative">
                <div className="bg-white mx-2 md:mx-0 p-4 pt-8 rounded-lg shadow-xl flex flex-col gap-4">
                    <img className="mx-auto h-40 max-w-screen" src={frontendImage} alt="frontend image" />
                    <h1 className="text-2xl text-center underline decoration-purple-800 underline-offset-2">Frontend</h1>
                    <div className="text-purple-800 text-center">
                        {[
                            "css",
                            "Javascript",
                            "Tailwindcss",
                            "Bootstrap",
                            "React.Js"
                        ].map(item => <span key={item} className="inline-block border px-3 rounded-lg border-purple-900 m-1 mx-2">{item}</span>)}
                    </div>
                </div>

                <div className="bg-white mx-2 md:mx-0 p-4 pt-8 rounded-lg shadow-xl flex flex-col gap-4">
                    <img className="mx-auto h-40 max-w-screen" src={backendImage} alt="backend image" />
                    <h1 className="text-2xl text-center underline decoration-purple-800 underline-offset-2">Backend</h1>
                    <div className="text-purple-800 text-center">
                        {[
                            "Express.js",
                            "Javascript",
                            "Typescript",
                            "Next.js"
                        ].map(item => <span key={item} className="inline-block border px-3 rounded-lg border-purple-900 m-1 mx-2">{item}</span>)}
                    </div>
                </div>

                <div className="bg-white mx-2 md:mx-0 p-4 pt-8 rounded-lg shadow-xl flex flex-col gap-4">
                    <img className="mx-auto h-40 max-w-screen" src={databaseImage} alt="database image" />
                    <h1 className="text-2xl text-center underline decoration-purple-800 underline-offset-2">Banco de dados</h1>
                    <div className="text-purple-800 font-thin text-center">
                        {[
                            "MongoDB",
                            "MySql",
                            "SQL Server"
                        ].map(item => <span key={item} className="inline-block border px-3 rounded-lg border-purple-900 m-1 mx-2">{item}</span>)}
                    </div>
                </div>

                <div className="bg-white mx-2 md:mx-0 p-4 pt-8 rounded-lg shadow-xl flex flex-col gap-4 sm:col-start-2">
                    <img className="mx-auto h-40 max-w-screen" src={toolsImage} alt="tools image" />
                    <h1 className="text-2xl text-center underline decoration-purple-800 underline-offset-2">Ferramentas</h1>
                    <div className="text-purple-800 text-center">
                        {[
                            "Visual Studio Code",
                            "Visual Studio",
                            "Github"
                        ].map(item => <span key={item} className="inline-block border px-3 rounded-lg border-purple-900 m-1 mx-2">{item}</span>)}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Index