import React, { useEffect, useState } from "react";

import { useAuth } from "@hooks/useAuth";
import linkfy from "@utils/linkfy";
import merge from "lodash/merge";
import api from "@services/api";
import FloatingLabelInput from "@components/Inputs/FloatingLabelInput";

import { Topic } from "@classes/blog";

import { IoIosClose } from "react-icons/io";
import { VscLoading } from "react-icons/vsc";
import { PromiseT } from "types/promise.types";

type Status = "loading" | "success" | "error" | "input-warnings" | "idle";

interface TopicForm {
  topic?: Topic;
  onClose: () => void;
  onSuccess: () => void;
}

const TopicForm = ({
  topic = { name: "", link: "", description: "", image: "" },
  onClose,
  onSuccess,
}) => {
  const { cookies } = useAuth();

  const [status, setStatus] = useState<Status>("idle");

  const [inputsMessages, setInputsMessages] = useState<{
    [key: string]: string[];
  }>({});

  const [submitTopic, setSubmitTopic] = useState<PromiseT<Topic>>({
    status: "idle",
    data: topic,
  });

  const HandleSaveTopic = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (
      ["topic-form-name", "topic-form-link"].some(
        (input) => inputsMessages[input]?.length > 0
      )
    ) {
      setStatus("input-warnings");
    } else {

      if(submitTopic.status === "loading") return;
      setSubmitTopic((prevSubmitTopic) => ({
        ...prevSubmitTopic,
        status: "loading",
      }))

      let headers = { authorization: `Bearer ${cookies.authentication}` };

      (submitTopic.data?._id
        ? api.put("/topics", submitTopic.data, { headers })
        : api.post("/topics", submitTopic.data, { headers })
      )
        .then(() => {
          onSuccess();
        })
        .catch((err) => {
          console.error(err);
          setSubmitTopic((prevSubmitTopic) => ({
            ...prevSubmitTopic,
            status: "error",
          }));
          setInputsMessages((prevaterts) => ({
            ...prevaterts,
            "topic-form": [
              err?.message ||
                `Ocorreu um erro ao ${
                  submitTopic.data?._id ? "editar" : "adicionar"
                } tópico!`,
            ],
          }));
        });
    }
  };

  useEffect(() => {
    let messages = {
      "topic-form-name": [],
      "topic-form-link": [],
    };

    if (!(submitTopic.data.name.length > 0))
      messages["topic-form-name"] = [`Nome é obrigatório`];
    else if (!(submitTopic.data.name.length > 3))
      messages["topic-form-name"] = [`Nome deve ter no mínimo 3 caracteres`];

    if (!(submitTopic.data.link.length > 0))
      messages["topic-form-link"] = [`Link é obrigatório`];
    else if (!(submitTopic.data.link.length > 3))
      messages["topic-form-link"] = [`Link deve ter no mínimo 3 caracteres`];
    else if (submitTopic.data.link.endsWith("-"))
      messages["topic-form-link"] = [`Link não pode terminar em "-"`];

    setInputsMessages((previnputsMessages) => ({
      ...previnputsMessages,
      ...messages,
    }));
  }, [submitTopic]);

  function HandleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    let aditionalProperties = {};

    if (event.target.name == "title")
      aditionalProperties = { link: linkfy(event.target.value) };

    setSubmitTopic((prevSubmitTopic) =>
      merge(
        { ...prevSubmitTopic },
        {
          data: {
            [event.target.name]: event.target.value,
            ...aditionalProperties,
          },
        }
      )
    );
  }

  const InputStatus = (inputName: string) =>
    submitTopic.status === "input-warnings" &&
    inputsMessages[`topic-form-${inputName}`]?.length > 0
      ? "error"
      : "info";

  return (
    <>
      <div className="flex gap-2 justify-between items-center rounded-t-lg bg-indigo-600 text-white py-3">
        <h1 className="px-4 text-xl font-bold text-white">
          {submitTopic.data?._id
            ? `Editar tópico - ${submitTopic.data.name}`
            : "Novo tópico"}
        </h1>
        <button
          onClick={onClose}
          className="mx-2 hover:opacity-90 transition hover:scale-110"
        >
          <IoIosClose size={35} />
        </button>
      </div>
      <form onSubmit={HandleSaveTopic} className="m-6">
        <div className="my-5">
          <FloatingLabelInput
            label="Nome"
            name="name"
            defaultValue={submitTopic.data?.name}
            onChange={HandleChangeInput}
            status={InputStatus("name")}
            messages={inputsMessages["topic-form-name"]}
          />
        </div>
        <div className="my-5">
          <FloatingLabelInput
            label="Link"
            name="link"
            value={submitTopic.data?.link}
            onChange={HandleChangeInput}
            status={InputStatus("link")}
            messages={inputsMessages["topic-form-link"]}
          />
        </div>
        <div className="my-5">
          <FloatingLabelInput
            label="Descrição"
            name="description"
            type="textarea"
            value={submitTopic.data?.description}
            onChange={HandleChangeInput}
            status={InputStatus("description")}
            messages={inputsMessages["topic-form-description"]}
          />
        </div>
        <hr className="my-4" />
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-700 shadow-lg shadow-indigo-700/30 rounded-xl text-white py-2 px-4 hover:scale-105 transition font-semibold"
          >
            {status === "loading" ? (
              <VscLoading className="animate-spin text-lg mx-6 my-0.5" />
            ) : submitTopic.data?._id ? (
              `Salvar informações`
            ) : (
              "Adicionar tópico"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2 transition px-4 text-zinc-800 bg-zinc-200 hover:bg-zinc-300 font-semibold rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
};

export default TopicForm;
