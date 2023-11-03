export type PromiseT<dataT> = {
    status: "idle" | "loading" | "success" | "error" | "input-warnings";
    data?: dataT;
    error?: any;
  };