import React from "react";
import Form from "../../../components/form";
import AdminLayout from "../../../layouts/AdminLayout";

const NewPostPage = () => {
    return (
        <AdminLayout>
            <div className="container pt-8 p-4 h-full">
                <Form link={undefined} />
            </div>
        </AdminLayout>
    );
}

export default NewPostPage