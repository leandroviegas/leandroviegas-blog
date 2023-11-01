import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";

import moment from "moment";

import TextEditor from "@components/TextEditor";
import OpaqueBackground from "@components/OpaqueBackground";
import Toggle from "@components/Inputs/Toggle";
import FloatingLabelInput from "@components/Inputs/FloatingLabelInput";
import TopicForm from "@components/Forms/TopicForm";

import api from "@services/api";
import linkfy from "@utils/linkfy";
import { useAuth } from "@hooks/useAuth";

import "@styles/suneditor-contents.min.css";
import "@styles/suneditor.min.css";

import { Topic, Post } from "@classes/blog";

import { VscLoading } from "react-icons/vsc";
import { BiUpload } from "react-icons/bi";

import merge from "lodash/merge";
import usePromise from "@hooks/usePromise";

type FormType = Omit<Post, "topics"> & {
  topics: string[];
  imageFile: { file: File; preview: string };
};

const PostForm = (post: Omit<Post, "topics"> & { topics: string[] }) => {
  const { cookies } = useAuth();

  const [inputsMessages, setInputsMessages] = useState<{
    [key: string]: string[];
  }>({});

  const [popup, setPopup] = useState<"topic-form" | "">("");

  const [submitPost, setSubmitPost, ExecSubmitPost] = usePromise<FormType>({
    data: merge(
      {
        title: "",
        content: "",
        image: "",
        link: "",
        readTime: 0,
        active: true,
        keywords: "",
        description: "",
        modifiedAt: new Date(),
        postedAt: new Date(),
        topics: [],
        imageFile: { file: null, preview: "" },
      },
      { ...post }
    ),
    status: "idle",
  });

  const [topics, setTopics, ExecTopics] = usePromise<Topic[]>({
    status: "idle",
    data: [],
  });

  async function HandleSumbitPost(evt?: React.FormEvent<HTMLFormElement>) {
    evt && evt.preventDefault();

    if (
      ["post-form-title", "post-form-link"].some(
        (input) => inputsMessages[input].length > 0
      )
    ) {
      setSubmitPost((prevFormSubmit) => ({
        ...prevFormSubmit,
        status: "input-warnings",
      }));
    } else {
      const headers = { authorization: `Bearer ${cookies.authentication}` };

      const formdata = new FormData();

      Object.entries({
        ...submitPost.data,
        topics: JSON.stringify(submitPost.data?.topics),
        imageFile: submitPost.data?.imageFile.file,
      }).forEach(([key, value]) => {
        formdata.append(key, String(value));
      });

      const result = await ExecSubmitPost(
        submitPost.data?._id
          ? api.put("/posts", formdata, { headers })
          : api.post("/posts", formdata, { headers })
      );

      if (result.status === "success") navigate("/dashboard/posts/list");

      if (result.status === "error") {
        console.error(result.error);
        setSubmitPost((prevFormSubmit) => ({
          ...prevFormSubmit,
          status: "input-warnings",
        }));
      }
    }
  }

  const HandleLoadTopics = async () => {
    const result = await ExecTopics(api.get("/topics/list"));

    if (result.status === "success")
      setTopics((prevTopics) => ({
        ...prevTopics,
        data: result.response.data?.topics,
      }));

    if (result.status === "error") {
      console.error(result.error);
      setTopics({ status: "error", data: [] });
      setInputsMessages({
        ...inputsMessages,
        "post-form": [
          result.error?.response?.data?.message ||
            `Ocorreu um erro ao carregar tópicos.`,
        ],
      });
    }
  };

  function HandleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    let value;

    switch (event.target.type) {
      case "checkbox":
        value = event.target.checked;
        break;
      case "datetime-local":
        value = new Date(event.target.value);
        break;
      case "number":
        value = Number(event.target.value);
        break;
      default:
        value = event.target.value;
    }

    let aditionalProperties = {};

    if (event.target.name == "title")
      aditionalProperties = { link: linkfy(value) };

    setSubmitPost((prevFormSubmit) =>
      merge(
        { ...prevFormSubmit },
        {
          data: {
            [event.target.name]: value,
            ...aditionalProperties,
          },
        }
      )
    );
  }

  const InputStatus = (inputName: string) =>
    submitPost.status === "input-warnings" &&
    inputsMessages[`post-form-${inputName}`]?.length > 0
      ? "error"
      : "info";

  const HandleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files.length > 0)
      setSubmitPost((prevFormSubmit) =>
        merge(prevFormSubmit, {
          data: {
            imageFile: {
              file: event.target.files[0],
              preview: URL.createObjectURL(event.target.files[0]),
            },
          },
        })
      );
  };

  useEffect(() => {
    let messages = {
      "post-form-title": [],
      "post-form-link": [],
    };

    if (!(submitPost.data?.title?.length > 0))
      messages["post-form-title"] = [`Nome é obrigatório`];
    else if (!(submitPost.data?.title?.length > 3))
      messages["post-form-title"] = [`Nome deve ter no mínimo 3 caracteres`];

    if (!(submitPost.data?.link?.length > 0))
      messages["post-form-link"] = [`Link é obrigatório`];
    else if (!(submitPost.data?.link?.length > 3))
      messages["post-form-link"] = [`Link deve ter no mínimo 3 caracteres`];
    else if (submitPost.data?.link?.endsWith("-"))
      messages["post-form-link"] = [`Link não pode terminar em "-"`];

    setInputsMessages((prevMessages) => ({ ...prevMessages, ...messages }));
  }, [submitPost]);

  useEffect(() => {
    HandleLoadTopics();
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg shadow-black-50/10">
      <OpaqueBackground
        open={popup === "topic-form"}
        closeCallback={() => setPopup("")}
      >
        <div
          data-aos="fade-down"
          className="bg-white dark:bg-zinc-900 shadow-lg shadow-violet-700/40 rounded-lg w-96 max-w-screen"
        >
          <TopicForm
          
            onClose={() => setPopup("")}
            onSuccess={() => {
              setPopup("");
              HandleLoadTopics();
            }}
          />
        </div>
      </OpaqueBackground>

      <div className="flex items-center px-4 py-2 rounded-t-lg bg-gradient-to-r to-violet-600 from-indigo-600 text-white justify-between">
        <h1 className="text-xl font-bold">
          {submitPost.data?.title
            ? "Editar - " + submitPost.data?.title
            : "Nova postagem"}
        </h1>
        <div className="flex items-center my-2">
          <label htmlFor="active" className="rounded-t-xl font-semibold mx-2">
            Rascunho:
          </label>
          <Toggle
            defaultChecked={submitPost.data?.active}
            onChange={HandleChangeInput}
            name="active"
          />
        </div>
      </div>
      <div className="py-2 p-4">
        {submitPost.status === "loading" && (
          <div className="flex justify-center my-44">
            <VscLoading className="text-5xl animate-spin text-indigo-800" />
          </div>
        )}
        {submitPost.status !== "loading" && (
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="px-3">
              <form onSubmit={HandleSumbitPost}>
                <div className="w-full my-5">
                  <FloatingLabelInput
                    label="Título"
                    name="title"
                    value={submitPost.data?.title}
                    onChange={HandleChangeInput}
                    status={InputStatus("title")}
                    messages={inputsMessages["post-form-title"]}
                  />
                </div>

                <div className="w-full my-5">
                  <FloatingLabelInput
                    label="Link da postagem"
                    name="link"
                    value={submitPost.data?.link}
                    onChange={HandleChangeInput}
                    status={InputStatus("link")}
                    messages={inputsMessages["post-form-link"]}
                  />
                </div>
              </form>
              <div className="w-full my-5">
                <TextEditor
                  onChange={() =>
                    setSubmitPost((prevFormSubmit) =>
                      merge(prevFormSubmit, { data: { content: "" } })
                    )
                  }
                  defaultValue={submitPost.data?.content}
                />
              </div>
            </div>
            <div className="px-3">
              <div className="w-full mt-5">
                <div className="flex items-center justify-center">
                  <label htmlFor="image" className="relative cursor-pointer">
                    <div className="absolute right-2 top-2 z-10">
                      <div className="bg-white p-2 rounded-full shadow-lg">
                        <BiUpload />
                      </div>
                    </div>
                    <img
                      src={
                        submitPost.data?.imageFile.preview ||
                        submitPost.data?.image ||
                        "https://via.placeholder.com/150"
                      }
                      alt={`${submitPost.data?.title} Profile Picture`}
                      className="object-cover relative h-[200px] w-full mx-auto rounded shadow-xl mb-4"
                    />
                    <input
                      type="file"
                      onClick={(evt) => (evt.currentTarget.value = null)}
                      onChange={HandleChangeImage}
                      className="hidden"
                      accept="image/*"
                      id="image"
                      name="image"
                    />
                  </label>
                </div>
                <div className="flex items-center justify-center flex-wrap gap-2 grow"></div>
              </div>
              <div className="my-5">
                <div className="flex gap-5">
                  <div className="grow">
                    <FloatingLabelInput
                      label="Procurar por tópico"
                      name="topic-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPopup("topic-form")}
                    className="bg-indigo-600 hover:bg-indigo-700 my-0.5 transition font-semibold text-white px-3 rounded"
                  >
                    Novo tópico
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-3">
                  {topics.data
                    ?.filter((topic) =>
                      submitPost.data?.topics?.includes(topic?._id ?? "")
                    )
                    .map((topic) => (
                      <button
                        type="button"
                        onClick={() =>
                          setSubmitPost((prevFormSubmit) =>
                            merge(prevFormSubmit, {
                              data: {
                                topics: prevFormSubmit.data?.topics.filter(
                                  (t) => t !== topic?._id
                                ),
                              },
                            })
                          )
                        }
                        className="cursor-pointer text-sm px-2 border border-indigo-700 text-indigo-700 rounded"
                        key={topic?._id}
                      >
                        {topic.name}
                      </button>
                    ))}
                  {topics.data
                    ?.filter(
                      (topic) =>
                        !submitPost.data?.topics?.includes(topic?._id ?? "")
                    )
                    .map((topic) => (
                      <button
                        type="button"
                        onClick={() =>
                          setSubmitPost((prevFormSubmit) =>
                            merge(prevFormSubmit, {
                              data: {
                                topics: [
                                  ...prevFormSubmit.data?.topics,
                                  topic?._id ?? "",
                                ],
                              },
                            })
                          )
                        }
                        className="cursor-pointer text-sm px-2 border border-zinc-500 text-zinc-300 rounded"
                        key={topic?._id}
                      >
                        {topic.name}
                      </button>
                    ))}
                </div>
              </div>
              <form onSubmit={HandleSumbitPost}>
                <div className="w-full flex flex-col flex-wrap sm:flex-row gap-1 md:gap-2 lg:gap-4">
                  <div className="my-5">
                    <FloatingLabelInput
                      label={`${true ? "Postar" : "Postado"} em`}
                      type="datetime-local"
                      name="postedAt"
                      defaultValue={moment(submitPost.data?.postedAt).format(
                        "YYYY-MM-DDThh:mm"
                      )}
                      onChange={HandleChangeInput}
                      status={InputStatus("postedAt")}
                      messages={inputsMessages["post-form-postedAt"]}
                    />
                  </div>
                  <div className="my-5">
                    <FloatingLabelInput
                      label="Editado em"
                      type="datetime-local"
                      name="modifiedAt"
                      defaultValue={moment(submitPost.data?.modifiedAt).format(
                        "YYYY-MM-DDThh:mm"
                      )}
                      onChange={HandleChangeInput}
                      status={InputStatus("modifiedAt")}
                      messages={inputsMessages["post-form-modifiedAt"]}
                    />
                  </div>
                </div>

                <div className="w-full my-5">
                  <FloatingLabelInput
                    label="Palavras chaves"
                    type="textarea"
                    name="keywords"
                    defaultValue={submitPost.data?.keywords}
                    onChange={HandleChangeInput}
                    status={InputStatus("keywords")}
                    messages={inputsMessages["post-form-keywords"]}
                  />
                </div>

                <div className="w-full my-5">
                  <FloatingLabelInput
                    label="Descrição"
                    type="textarea"
                    name="description"
                    defaultValue={submitPost.data?.description}
                    onChange={HandleChangeInput}
                    status={InputStatus("description")}
                    messages={inputsMessages["post-form-description"]}
                  />
                </div>
                <div className="w-full my-5">
                  <div className="my-5 w-[192px]">
                    <FloatingLabelInput
                      label="Tempo de leitura (minutos)"
                      type="number"
                      name="readTime"
                      defaultValue={submitPost.data?.readTime}
                      onChange={HandleChangeInput}
                      status={InputStatus("readTime")}
                      messages={inputsMessages["post-form-readTime"]}
                    />
                  </div>
                </div>
                <input type="submit" className="hidden" />
              </form>
            </div>
          </div>
        )}
        <hr className="my-2" />
        <div className="py-2">
          <button
            onClick={() => HandleSumbitPost()}
            className="hover:scale-110 bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-white px-3 py-1 rounded"
          >
            {submitPost.status === "loading" ? (
              <VscLoading className="animate-spin text-lg mx-6 my-0.5" />
            ) : submitPost.data?._id ? (
              "Salvar alterações"
            ) : (
              "Publicar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
