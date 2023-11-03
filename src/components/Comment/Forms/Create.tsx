import React, { ReactNode, useState } from "react";
import api from "@services/api";
import { useAuth } from "@hooks/useAuth";
import merge from "lodash/merge";

import { toast } from "react-toastify";

import { BiPaperPlane } from "react-icons/bi";

import { PromiseT } from "types/promise.types";

type CommentFormProps = {
  post_id: string;
  referenceComment: string;
  children?: ReactNode;
  CommentCallback: () => void;
};

const CommentForm = ({
  post_id,
  referenceComment,
  CommentCallback,
  children,
}: CommentFormProps) => {
  const { cookies, user } = useAuth();

  const [comment, setComment] = useState<PromiseT<{ content: string }>>({
    status: "idle",
    data: { content: "" },
  });

  async function HandleComment(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    if (comment.status === "loading") return;
    setComment((prevComment) => ({ ...prevComment, status: "loading" }));

    const headers = { authorization: `Bearer ${cookies.authentication}` };

    api
      .post(
        `/posts/comments`,
        { post: post_id, referenceComment, content: comment.data?.content },
        { headers }
      )
      .then(() => {
        setComment({ status: "success", data: { content: "" } });
        CommentCallback();
      })
      .catch((err) => {
        console.error(err);
        setComment((prevComment) => ({ ...prevComment, status: "error" }));
        toast(`Erro ao comentar:\n ${err.response?.data?.message || err.message}`, {
          position: "bottom-left",
          autoClose: 3000,
          type: "error",
        });
      });
  }

  return (
    <>
      {user?._id && (
        <div className="px-6 py-2 bg-white dark:bg-zinc-900 rounded-lg">
          <form onSubmit={HandleComment}>
            <textarea
              value={comment.data?.content}
              onChange={(e) =>
                setComment((prevComment) =>
                  merge(
                    { ...prevComment },
                    { data: { content: e.target.value } }
                  )
                )
              }
              className="w-full h-12 rounded-lg resize-none py-2 text-zinc-600 dark:text-zinc-300 bg-transparent outline-none"
              placeholder="Escreva um comentário"
            />
            <hr />
            <div className="my-2 flex items-center gap-4">
              <button
                type={comment.data?.content.trim() ? "submit" : "button"}
                className="text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400 text-sm py-2 rounded-lg font-medium flex items-center gap-1"
              >
                <BiPaperPlane size={18} />
                {referenceComment ? "Responder" : "Comentar"}
              </button>
              {children}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CommentForm;
