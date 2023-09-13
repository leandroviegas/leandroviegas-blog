import React from 'react';
import { Link } from "gatsby";

import AdminLayout from "@layouts/AdminLayout";
import Head from "@components/Head";

const Index = () => {
    return (
        <AdminLayout>
            <Head title={`Página não encontrada.`} />
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col gap-1 text-center text-zinc-600">
                    <img className="mx-auto w-64 max-w-screen my-4" src="/static/images/notfound.svg" alt="Not found image" />
                    <h2 className="text-lg font-thin">Página não encontrada</h2>
                    <Link className="text-cyan-500 hover:text-cyan-600 hover:underline" to="/admin/dashboard">Ir para Dashboard</Link>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Index