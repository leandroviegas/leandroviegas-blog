import React, { useEffect, useState } from "react";

import api from "@services/api";
import { useAuth } from "@hooks/Auth";
import truncate from "@utils/truncate";

import OpaqueBackground from "@components/OpaqueBackground";
import DashboardLayout from "@layouts/DashboardLayout";
import DeletePopup from "@components/Popups/DeletePopup";
import TopicForm from "@components/Forms/TopicForm";
import Alert from "@components/Alert";
import SeoHead from "@components/Head";

import { Topic } from "@classes/blog";

import { VscLoading } from "react-icons/vsc";
import { BiCategoryAlt } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

type Status = "loading" | "success" | "error" | "input-warnings" | "";

export function Head() {
  return <SeoHead title={`Listar tópicos - Leandro Viegas`} />;
}

function Index() {
  const { cookies } = useAuth();

  const [popup, setPopup] = useState<"topic-form" | "delete" | "">("");

  const [topics, setTopics] = useState<{ status: Status; data: Topic[] }>({
    status: "",
    data: [],
  });

  const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({});

  const HandleLoadTopics = () => {
    if (topics.status === "loading") return;
    setTopics({ status: "loading", data: [] });

    api
      .get("/topics/list")
      .then((resp) => {
        setTopics({ status: "success", data: resp.data?.topics });
      })
      .catch((err) => {
        console.error(err);
        setTopics({ status: "error", data: [] });
        setAlerts({
          ...alerts,
          topic: [
            err?.response?.data?.message ||
              "Ocorreu um erro ao carregar tópicos!",
          ],
        });
      });
  };

  const [selectedTopic, setSelectedTopic] = useState<Topic>({
    name: "",
    link: "",
    image: "",
    description: "",
  });

  const [deleteStatus, setDeleteStatus] = useState<Status>("");

  const HandleDeleteTopic = () => {
    if (deleteStatus === "loading") return;
    setDeleteStatus("loading");

    api
      .delete("/topics", {
        headers: { authorization: `Bearer ${cookies.authentication}` },
        params: { _id: selectedTopic?._id },
      })
      .then((resp) => {
        setDeleteStatus("success");
        HandleLoadTopics();
        setPopup("");
      })
      .catch((err) => {
        console.error(err);
        setDeleteStatus("error");
        setAlerts({
          ...alerts,
          "topic-delete": [
            err?.response?.data?.message || "Ocorreu um erro ao apagar tópico!",
          ],
        });
      });
  };

  useEffect(() => {
    if (popup === "") {
      setAlerts({});
      setSelectedTopic({ name: "", link: "", image: "", description: "" });
    }
  }, [popup]);

  useEffect(() => {
    HandleLoadTopics();
  }, []);

  return (
    <DashboardLayout>
      <OpaqueBackground
        open={popup === "topic-form"}
        closeCallback={() => setPopup("")}
      >
        <div
          data-aos="fade-down"
          className="bg-white dark:bg-zinc-900 shadow-md shadow-indigo-800/40 rounded-lg w-96 max-w-screen"
        >
          <TopicForm
            onClose={() => setPopup("")}
            onSuccess={() => {
              setPopup("");
              HandleLoadTopics();
            }}
            topic={selectedTopic}
          />
        </div>
      </OpaqueBackground>

      <DeletePopup
        status={deleteStatus === "loading" ? deleteStatus : ""}
        errors={alerts["topic-delete"]}
        btnText="Apagar tópico"
        open={popup === "delete"}
        onDelete={HandleDeleteTopic}
        onCancel={() => setPopup("")}
        text={`Você tem certeza que deseja apagar a tópico "${selectedTopic?.name}". Caso você apague a tópico você não conseguirá recuperar os dados dela.`}
      />

      {topics.status === "success" && topics.data.length > 0 && (
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
                  className="outline-none h-full px-2 py-1 text-gray-400 border-b bg-transparent"
                />
              </form>
            </div>
            <hr className="my-4" />
            {alerts[""]?.map((message, index) => (
              <Alert key={index} message={message} type="error" />
            ))}
            <div className="my-6">
              <button
                onClick={() => setPopup("topic-form")}
                className="shadow-lg shadow-indigo-500/30 hover:scale-110 bg-indigo-500 hover:bg-indigo-700 transition font-semibold text-white px-3 py-1 rounded"
              >
                Novo Tópico
              </button>
            </div>
            <div className="my-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {topics.data.map((topic) => {
                return (
                  <div
                    key={topic?._id}
                    className="border dark:border-transparent dark:bg-zinc-800 border-zinc-300 rounded-xl flex flex-col"
                  >
                    <div className="grow pt-2 flex flex-col gap-2 pb-2 px-4 w-full text-zinc-700 dark:text-zinc-300 rounded-t-lg break-words">
                      <p className="text-xl font-semibold">{topic?.name}</p>
                      <p className="font-thin opacity-80 whitespace-normal">
                        {truncate(topic?.description, 100)}
                      </p>
                      <a
                        href={`/blog/topic/${topic.link}`}
                        target="_blank"
                        className="text-sm opacity-80 underline"
                      >
                        /blog/topic/{topic.link}
                      </a>
                    </div>
                    <hr />
                    <div className="p-3  bg-indigo-500 shadow-md shadow-indigo-500/40 rounded-b-xl font-semibold flex items-center gap-4 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedTopic(topic);
                          setPopup("topic-form");
                        }}
                        className="bg-yellow-400 text-zinc-800 hover:bg-yellow-500 transition rounded px-3 py-1"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTopic(topic);
                          setPopup("delete");
                        }}
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

      {topics.status === "loading" && (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-indigo-700">
            <VscLoading className="animate-spin text-5xl" />
          </div>
        </div>
      )}

      {topics.status === "success" && topics.data.length === 0 && (
        <div className="h-full flex flex-col">
          <div className="mt-8 mx-2 md:mx-6">
            <hr className="border-indigo-800" />
            <div className="flex gap-6 text-indigo-800 mt-6">
              <BiCategoryAlt className="text-4xl mt-3" />
              <div>
                <h2 className="text-2xl font-bold">
                  {" "}
                  Nenhuma tópico criada ainda
                </h2>
                <p className="text-indigo-700 text-xl my-1 font-semibold">
                  Que tal criar uma tópico nova?
                </p>
                <button
                  onClick={() => setPopup("topic-form")}
                  className="bg-indigo-500 hover:bg-indigo-700 transition font-semibold text-white px-3 py-1 rounded my-4"
                >
                  Nova Tópico
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Index;
