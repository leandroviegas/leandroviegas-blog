import React, { useEffect, useState } from "react";
import { useAuth } from "@hooks/useAuth";

import FloatingLabelInput from "@components/Inputs/FloatingLabelInput";
import validator from "validator";
import merge from "lodash/merge";

import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";
import { PromiseT } from "types/promise.types";

const SignInForm = ({ onSuccess }) => {
  const { signUp } = useAuth();

  const [inputsMessages, setInputsMessages] = useState<{
    [key: string]: string[];
  }>({});

  const [form, setForm] = useState<
    PromiseT<{
      email: string;
      username: string;
      password: string;
      passwordverification: string;
    }>
  >({
    status: "idle",
    data: { email: "", username: "", password: "", passwordverification: "" },
  });

  const HandleSignUp = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (
      ["username-error", "email-error", "password-error"].some(
        (errors) => inputsMessages[errors]?.length > 0
      )
    ) {
      setForm((prevForm) => ({ ...prevForm, status: "input-warnings" }));
      return;
    }

    if (form.status === "loading") return;

    setForm((prevForm) => ({ ...prevForm, status: "loading" }));

    signUp(form.data.username, form.data.email, form.data.password)
      .then(() => {
        setForm({
          status: "success",
          data: {
            email: "",
            username: "",
            password: "",
            passwordverification: "",
          },
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
          `Erro ao registrar-se:\n ${
            err.response?.data?.message || err.message
          }`,
          {
            position: "top-center",
            autoClose: 3000,
            type: "error",
          }
        );
      });
  };

  useEffect(() => {
    let messages = {
      "username-error": [],
      "email-error": [],
      "password-verification": [],
      "password-error": [],
    };
    if (!(form.data.username.length > 0))
      messages["username-error"] = [
        "O campo de usuário ou e-mail é obrigatório",
      ];
    else if (!(form.data.username.length > 3))
      messages["username-error"] = [
        "O campo de usuário ou e-mail deve ter mais de 3 caracteres",
      ];

    if (!(form.data.email.length > 0))
      messages["email-error"] = ["O campo de e-mail é obrigatório"];
    else if (!validator.isEmail(form.data.email))
      messages["email-error"] = ["O campo de e-mail é inválido"];

    if (!(form.data.password.length > 0))
      messages["password-error"] = ["Senha é obrigatória"];
    else if (form.data.password.length < 8)
      messages["password-error"] = ["Senha deve ter pelo menos 8 caracteres"];
    else if (!form.data.password.match(/[A-Z]/))
      messages["password-error"] = [
        "Senha deve ter pelo menos uma letra maiúscula",
      ];
    else if (!form.data.password.match(/[a-z]/))
      messages["password-error"] = [
        "Senha deve ter pelo menos uma letra minúscula",
      ];
    else if (!form.data.password.match(/[^a-zA-Z\d]/))
      messages["password-error"] = [
        "Senha deve ter pelo menos um caractere especial",
      ];

    if (form.data.password !== form.data.passwordverification)
      messages["password-verification"] = ["Senhas não correspondem"];

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
    <form onSubmit={HandleSignUp} className="flex flex-col gap-3">
      <div className="my-2">
        <FloatingLabelInput
          label="Usuário"
          name="username"
          status={InputStatus("username-error")}
          messages={inputsMessages["username-error"]}
          defaultValue=""
          onChange={onInputChange}
        />
      </div>
      <div className="my-2">
        <FloatingLabelInput
          label="Email"
          name="email"
          status={InputStatus("email-error")}
          messages={inputsMessages["email-error"]}
          defaultValue=""
          onChange={onInputChange}
        />
      </div>
      <div className="my-2">
        <FloatingLabelInput
          label="Senha"
          name="password"
          status={InputStatus("password-error")}
          messages={inputsMessages["password-error"]}
          defaultValue=""
          onChange={onInputChange}
          type="password"
        />
      </div>
      <div className="my-2">
        <FloatingLabelInput
          label="Validar senha"
          name="passwordverification"
          status={InputStatus("password-verification")}
          messages={inputsMessages["password-verification"]}
          defaultValue=""
          onChange={onInputChange}
          type="password"
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
            "Registrar-se"
          )}
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
