import React, { forwardRef, useEffect, useImperativeHandle } from "react";

import { BsGoogle } from "react-icons/bs";

import OpaqueBackground from "@components/OpaqueBackground";
import SignIn from "./Forms/SignIn";
import SignUp from "./Forms/SignUp";
import { useAuth } from "@hooks/useAuth";

type Tabs = "SignUp" | "SignIn";

const SignPopup = forwardRef<unknown, any>((_, ref) => {
  const [tab, setTab] = React.useState<Tabs>();
  const [popped, setPopped] = React.useState<boolean>(false);

  const { triggerLogin, setTriggerLogin } = useAuth();

  useEffect(() => {
    setTriggerLogin(false);
    setPopped(true);
    setTab("SignIn");
  }, [triggerLogin])

  useImperativeHandle(ref, () => ({
    setPopup: (tab: Tabs) => {
      setTab(tab), setPopped(true);
    },
  }));

  const location =
    typeof window !== "undefined" ? window.location : { href: "" };

  return (
    <>
      {popped && (
        <OpaqueBackground closeCallback={() => setPopped(false)}>
          <div
            data-aos="fade-down"
            className="md:top-4 absolute max-h-full h-full md:h-auto overflow-y-auto mx-auto bg-white dark:bg-zinc-900 rounded-lg max-w-screen max-w-[550px] w-full shadow"
          >
            <div className="p-8 text-zinc-700 rounded-t-lg h-auto">
              <div className="grid grid-cols-2 border dark:border-zinc-700 rounded">
                <button
                  onClick={() => setTab("SignIn")}
                  className={`font-semibold w-full ${
                    tab === "SignIn"
                      ? "bg-violet-700 text-white"
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900"
                  } transition py-2 rounded`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setTab("SignUp")}
                  className={`font-semibold w-full ${
                    tab === "SignUp"
                      ? "bg-violet-700 text-white"
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900"
                  } transition py-2 rounded`}
                >
                  Registrar-se
                </button>
              </div>
              <div className="flex justify-center items-center py-8 pb-5">
                <span className="absolute text-sm bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-300">
                  Redes sociais
                </span>
                <hr className="w-full" />
              </div>

              <div className="w-full flex justify-center py-3">
                <button className="bg-red-500 rounded-lg text-white transition hover:bg-red-600">
                  <a
                    className="flex items-center px-4 py-2 gap-2 font-semibold"
                    href={`${
                      process.env.GATSBY_API_URL
                    }/auth?originRequestLink=${location.href ?? ""}`}
                  >
                    <span>
                      <BsGoogle />
                    </span>
                    <span className="text-sm opacity-90 font-normal">
                      Entrar com Google
                    </span>
                  </a>
                </button>
              </div>

              <div className="flex justify-center items-center py-3">
                <span className="absolute text-sm bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-300">
                  ou
                </span>
                <hr className="w-full" />
              </div>

              {tab === "SignIn" && (
                <SignIn onSuccess={() => setPopped(false)} />
              )}
              {tab === "SignUp" && (
                <SignUp onSuccess={() => setPopped(false)} />
              )}
            </div>
          </div>
        </OpaqueBackground>
      )}
    </>
  );
});

export default SignPopup;
