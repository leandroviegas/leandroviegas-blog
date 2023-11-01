import { useState } from "react";

type PromiseT<dataT, statusT> = {
  status: "idle" | "loading" | "success" | "error" | "input-warnings" | statusT;
  data?: dataT;
  error?: any;
};

function usePromise<
  dataT = unknown,
  statusT = "idle" | "loading" | "success" | "error"
>(initialPromises: PromiseT<dataT, statusT>) {
  const [promise, setPromise] =
    useState<PromiseT<dataT, statusT>>(initialPromises);

  async function Exec(
    promiseToExec: Promise<unknown>
  ): Promise<{
    response: any,
    status: statusT,
    error: any
  }> {
    if (promise.status != "loading") {
      setPromise({ status: "loading", error: undefined });

      return await promiseToExec
        .then((response) => {
          setPromise({ status: "success", error: undefined });
          return { status: "success" as statusT, response, error: undefined };
        })
        .catch((error) => {
          console.error(error);
          setPromise({ status: "error", error });
          return { status: "error" as statusT, response: undefined, error };
        });
    }

    return {
      status: promise.status as statusT,
      response: undefined,
      error: Error("Promise-already-loading"),
    };
  }

  function SetPromise(
    promiseToSet:
      | PromiseT<dataT, statusT>
      | ((prevPromise: PromiseT<dataT, statusT>) => PromiseT<dataT, statusT>)
  ) {
    setPromise(promiseToSet);
  }

  return [promise, SetPromise, Exec] as const;
}

export default usePromise;
