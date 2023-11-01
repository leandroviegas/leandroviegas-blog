import React from "react";
import Form from "@components/Forms/Post/Form";
import DashboardLayout from "@layouts/DashboardLayout";
import SeoHead from "@components/Head";

export function Head() {
  return <SeoHead title="Nova postagem - Leandro Viegas" />;
}

const NewPostPage = () => {
  return (
    <DashboardLayout>
      <div className="container pt-8 p-4 h-full">
        <Form />
      </div>
    </DashboardLayout>
  );
};

export default NewPostPage;
