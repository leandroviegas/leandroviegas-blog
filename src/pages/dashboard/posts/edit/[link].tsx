import React, { useEffect, useState } from "react";

import api from "@services/api";

import Form from "@components/Forms/Post/Form";
import SeoHead from "@components/Head";
import DashboardLayout from "@layouts/DashboardLayout";

import { Post } from "@classes/blog";
import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";
import { PromiseT } from "types/promise.types";

export function Head({ params }) {
  return (
    <SeoHead title={`${params?.link || "Editar postagem"} - Leandro Viegas`} />
  );
}

function Index({ params }) {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "">(
    ""
  );

  const [post, setPost] =
    useState<PromiseT<Omit<Post, "topics"> & { topics: string[] }>>();

  useEffect(() => {
    setStatus("loading");
    api
      .get("/posts", { params: { link: params.link } })
      .then((resp) => {
        setStatus("success");
        setPost(resp.data?.post);
      })
      .catch((err) => {
        setStatus("error");
        toast(
          `Ocorreu um erro ao carregar os postagens:\n ${
            err.response?.data?.message ||
            err.message ||
            `Erro ao carregar  postagem.`
          }`,
          {
            position: "top-center",
            autoClose: 3000,
            type: "error",
          }
        );
      });
  }, [params.link]);

  return (
    <DashboardLayout>
      <div className="container pt-8 p-4 h-full">
        {status === "success" && <Form post={post} />}

        {status === "loading" && (
          <div className="flex justify-center my-44">
            <VscLoading className="text-5xl animate-spin text-indigo-800" />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Index;
