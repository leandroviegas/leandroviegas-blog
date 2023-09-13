import React from "react";
import Form from "@components/Forms/PostForm";
import DashboardLayout from "@layouts/DashboardLayout";
import Head from "@components/Head";

const NewPostPage = () => {
    return (
        <DashboardLayout>
            <Head title="Nova postagem - Leandro Viegas" />
            <div className="container pt-8 p-4 h-full">
                <Form />
            </div>
        </DashboardLayout>
    );
}

export default NewPostPage