import React from "react";

import Layout from "../layouts/UserLayout"
import Head from "../components/Head"

const Index = () => {
    return (
        <Layout>
            <Head title="Sobre mim - Leandro Viegas" description="Sou desenvolvedor e trabalho com diversas tecnologias" />

            <div className="container grid grid-cols-1 lg:grid-cols-4 mx-auto">
                <div className="col-span-3 px-4 md:px-8 bg-white m-6 rounded">
                    <div className="my-12">
                        <h1 className="text-2xl mx-2 font-semibold text-zinc-900">Sobre mim</h1>
                        <hr className="my-2 border-gray-800" />
                        <div className="md:my-6 mx-2">
                            <p className="text-md font-thin">Desenvolvedor Full Stack em busca de fazer diferença na vida das pessoas e aplicar todo o aprendizado quem venho ganhando em algum tempo.</p>
                        </div>
                    </div>
                    {/* <div className="my-12">
                        <h1 className="text-2xl mx-2 font-semibold text-zinc-900">Cursos e formação</h1>
                        <hr className="my-2 border-gray-800" />
                        <div className="md:my-6 mx-2">
                            {
                                [
                                    {
                                        name: "",

                                    }
                                ].map(value => {
                                    return <>
                                    </>
                                })
                            }
                        </div>
                    </div> */}
                </div>
            </div>
        </Layout>
    )
}

export default Index