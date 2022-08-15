import React from "react";
import Form from "../../../../components/form";
import AdminLayout from "../../../../layouts/AdminLayout";

const Index = ({params}) => {
    return (
        <AdminLayout>
            <div className="container pt-8 p-4 h-full">
                <Form link={params.link} />
            </div>
        </AdminLayout>
    );
}

export default Index