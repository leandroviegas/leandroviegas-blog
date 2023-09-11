import React from 'react'
import { Link } from "gatsby"

import Layout from "@layouts/UserLayout"
import Head from "@components/Head"

import notFoundImage from "@images/notfound.svg"

const Index = () => {
    return (
        <Layout>
            <Head title={`Página não encontrada.`} />

            <div className="flex flex-col gap-1 text-center my-12 text-zinc-600">
                <img className="mx-auto w-64 max-w-screen my-4" src={notFoundImage} alt="Not found image" />
                <h2 className="text-lg font-thin">Página não encontrada</h2>
                <Link className="text-cyan-500 hover:text-cyan-600 hover:underline" to="/">Ir para a Página Inicial</Link>
            </div>
        </Layout>
    )
}

export default Index