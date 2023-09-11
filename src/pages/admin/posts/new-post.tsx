import React from "react";
import Form from "@components/Forms/PostForm";
import AdminLayout from "@layouts/AdminLayout";
import Head from "@components/Head";

const NewPostPage = () => {
    return (
        <AdminLayout>
            <Head title="Nova postagem - Leandro Viegas" />
            <div className="container pt-8 p-4 h-full">
                <Form />
            </div>
        </AdminLayout>
    );
}

export default NewPostPage