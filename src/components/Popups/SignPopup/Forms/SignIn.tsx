import React, { useEffect, useState } from "react";
import { useAuth } from "@hooks/useAuth";

import FloatingLabelInput from "@components/Inputs/FloatingLabelInput";

import { VscLoading } from "react-icons/vsc";
import { PromiseT } from "types/promise.types";
import { toast } from "react-toastify";

import merge from "lodash/merge";

const SignInForm = ({ onSuccess }) => {
  const { signIn } = useAuth();

  const [inputsMessages, setInputsMessages] = useState<{
    [key: string]: string[];
  }>({});

  const [form, setForm] = useState<
    PromiseT<{ usernameOrEmail: string; password: string }>
  >({ status: "idle", data: { usernameOrEmail: "", password: "" } });

  const HandleSignIn = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (
      ["username-or-email-error", "password-error"].some(
        (errors) => inputsMessages[errors]?.length > 0
      )
    ) {
      setForm((prevForm) => ({ ...prevForm, status: "input-warnings" }));
      return;
    }

    if (form.status === "loading") return;
    setForm((prevForm) => ({ ...prevForm, status: "loading" }));

    signIn(form.data.usernameOrEmail, form.data.password)
      .then(() => {
        setForm({
          status: "success",
          data: { usernameOrEmail: "", password: "" },
        });
        onSuccess();
      })
      .catch((err) => {
        console.error(err);
        setForm((prevForm) => ({
          ...prevForm,
          status: "error",
        }));
        toast(
          `Erro ao fazer login:\n ${
            err.response?.data?.message || err.message
          }`,
          {
            position: "bottom-left",
            autoClose: 3000,
            type: "error",
          }
        );
      });
  };

  useEffect(() => {
    let messages = {
      "username-or-email-error": [],
      "password-error": [],
    };
    if (!(form.data.usernameOrEmail.length > 0))
      messages["username-or-email-error"] = [
        "O campo de usuário ou e-mail é obrigatório",
      ];
    else if (!(form.data.usernameOrEmail.length > 3))
      messages["username-or-email-error"] = [
        "O campo de usuário ou e-mail deve ter mais de 3 caracteres",
      ];

    if (!(form.data.password.length > 0))
      messages["password-error"] = ["O campo de senha é obrigatório"];
    else if (!(form.data.password.length >= 8))
      messages["password-error"] = [
        "O campo de senha deve ter mais de 8 caracteres",
      ];

    setInputsMessages((previnputsMessages) => ({
      ...previnputsMessages,
      ...messages,
    }));
  }, [form]);

  function onInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setForm((prevForm) =>
      merge(
        { ...prevForm },
        {
          data: { [evt.target.name]: evt.target.value },
        }
      )
    );
  }

  const InputStatus = (inputName: string) =>
    form.status === "input-warnings" && inputsMessages[inputName]?.length > 0
      ? "error"
      : "info";

  return (
    <form onSubmit={HandleSignIn} className="flex flex-col gap-3">
      <div className="my-2">
        <FloatingLabelInput
          label="Email ou usuário"
          name="usernameOrEmail"
          status={InputStatus("username-or-email-error")}
          messages={inputsMessages["username-or-email-error"]}
          defaultValue=""
          onChange={onInputChange}
        />
      </div>
      <div className="my-2">
        <FloatingLabelInput
          label="Senha"
          name="password"
          type="password"
          status={InputStatus("password-error")}
          messages={inputsMessages["password-error"]}
          defaultValue=""
          onChange={onInputChange}
        />
      </div>
      <hr className="py-1" />
      <div className="w-full">
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-800 hover:text-white text-zinc-200 rounded text-lg font-semibold w-full px-3 py-2 transition"
        >
          {form.status === "loading" ? (
            <VscLoading className="animate-spin mx-auto text-2xl" />
          ) : (
            "Entrar"
          )}
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
