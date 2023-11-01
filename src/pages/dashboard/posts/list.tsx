import React, { useEffect, useState } from "react";
import { Link } from "gatsby";

import moment from "moment";
import api from "@services/api";
import { useAuth } from "@hooks/useAuth";
import truncate from "@utils/truncate";

import { Post } from "@classes/blog";

import SeoHead from "@components/Head";
import DashboardLayout from "@layouts/DashboardLayout";
import DeletePopup from "@components/Popups/DeletePopup";

import { VscLoading } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";
import { BsFileEarmarkPost } from "react-icons/bs";

import postplaceholderImage from "@images/post_placeholder.jpg";

type Status = "loading" | "success" | "error" | "";

export function Head() {
  return <SeoHead title="Listar postagens - Leandro Viegas" />;
}

function Index() {
  const { cookies } = useAuth();

  const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({});

  const [posts, setPosts] = useState<{ status: Status; data: Post[] }>({
    status: "",
    data: [],
  });

  function HandleLoadPosts() {
    if (posts.status === "loading") return;
    setPosts({ status: "loading", data: [] });

    api
      .get("/posts/list")
      .then((resp) => {
        setPosts({ status: "success", data: resp.data?.posts });
      })
      .catch((err) => {
        console.error(err);
        setPosts({ status: "error", data: [] });
        setAlerts({
          ...alerts,
          "post-list": [
            err?.response?.data?.message ||
              "Ocorreu um erro ao carregar postagens!",
          ],
        });
      });
  }

  const [deleteStatus, setDeleteStatus] = useState<Status>();

  const [selectedPost, setSelectedPost] = useState<Post>();

  const HandleDeletePost = () => {
    if (deleteStatus === "loading") return;
    setDeleteStatus("loading");

    api
      .delete(`/posts`, {
        params: { _id: selectedPost?._id },
        headers: { authorization: `Bearer ${cookies.authentication}` },
      })
      .then((resp) => {
        HandleLoadPosts();
        setSelectedPost(undefined);
        setDeleteStatus("success");
        setAlerts({ ...alerts, "post-delete": [] });
      })
      .catch((err) => {
        console.error(err);
        setDeleteStatus("error");
        setAlerts({
          ...alerts,
          "post-delete": [
            err?.response?.data?.message ||
              "Ocorreu um erro ao deletar postagem!",
          ],
        });
      });
  };

  useEffect(() => {
    HandleLoadPosts();
  }, []);

  return (
    <DashboardLayout>
      <DeletePopup
        status={deleteStatus === "loading" ? deleteStatus : ""}
        errors={alerts["post-delete"]}
        btnText="Apagar postagem"
        open={!!selectedPost}
        onDelete={HandleDeletePost}
        onCancel={() => {
          setSelectedPost(undefined);
          setAlerts({ ...alerts, "post-delete": [] });
        }}
        text={`Você tem certeza que deseja apagar essa postagem "${selectedPost?.title}". Caso você apague a postagem você não conseguirá recuperar os dados dela.`}
      />

      {posts.status === "success" && posts.data.length > 0 && (
        <div className="container">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 mx-4 my-8 shadow-lg">
            <div className="flex gap-2 my-4">
              <form className="h-8 flex items-center">
                <button className="h-full text-center flex items-center px-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-l">
                  <FaSearch />
                </button>
                <input
                  type="text"
                  placeholder="Procurar"
                  className="outline-none h-full px-2 py-1 text-gray-400 bg-transparent border-b"
                />
              </form>
            </div>
            <hr className="my-4" />
            <div className="my-6">
              <Link to="/dashboard/posts/new-post">
                <button className="shadow-md shadow-indigo-500/30 hover:scale-110 bg-indigo-500 hover:bg-indigo-700 transition font-semibold text-white px-3 py-1 rounded">
                  Nova Postagem
                </button>
              </Link>
            </div>
            <div className="my-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {posts.data.map((post) => {
                return (
                  <div
                    key={post?._id}
                    className="border dark:border-transparent dark:bg-zinc-800 border-zinc-300 rounded-xl flex flex-col"
                  >
                    <div className="grow break-words flex flex-col">
                      <img
                        className="h-32 w-full object-cover rounded-t-xl"
                        src={post.image || postplaceholderImage}
                        alt={post?.title}
                      />
                      <div className="my-2 grow px-4 flex flex-col gap-2">
                        <p className="text-xl font-semibold text-zinc-500 dark:text-zinc-300">
                          {post?.title}
                        </p>
                        <hr className="border-zinc-300" />
                        <p className="text-zinc-500 dark:text-zinc-300 grow">
                          {truncate(post?.description, 100)}
                        </p>
                        <span className="text-gray-500 dark:text-zinc-300 font-thin text-sm">
                          <span>Postado em: </span>
                          {moment(post?.postedAt).format("DD/MM/YYYY hh:mm")}
                        </span>
                      </div>
                    </div>
                    <hr />
                    <div className="p-3 bg-indigo-500 shadow-md shadow-indigo-500/40 rounded-b-xl font-semibold flex items-center gap-4 flex-wrap">
                      <Link to={`/dashboard/posts/edit/${post.link}`}>
                        <button className="bg-yellow-400 text-zinc-800 hover:bg-yellow-500 transition rounded px-3 py-1">
                          Editar
                        </button>
                      </Link>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="bg-red-500 text-white hover:bg-red-700 px-3 transition rounded py-1"
                      >
                        Apagar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {posts.status === "loading" && (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-indigo-700">
            <VscLoading className="animate-spin text-5xl" />
          </div>
        </div>
      )}

      {posts.status === "success" && posts.data.length === 0 && (
        <div className="h-full flex flex-col">
          <div className="mt-8 mx-2 md:mx-6">
            <hr className="border-indigo-800" />
            <div className="flex gap-6 text-indigo-800 mt-6">
              <BsFileEarmarkPost className="text-4xl mt-3" />
              <div>
                <h2 className="text-2xl font-bold">
                  Nenhuma postagem criada ainda
                </h2>
                <p className="text-indigo-700 text-xl my-1 font-semibold">
                  Que tal criar uma postagem nova?
                </p>
                <div className="my-4">
                  <Link
                    to="/dashboard/postagens/nova-postagem"
                    className="bg-indigo-500 hover:bg-indigo-700 transition font-semibold text-white px-3 py-1 rounded"
                  >
                    Nova Postagem
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Index;
