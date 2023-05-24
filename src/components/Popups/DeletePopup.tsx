import React, { useEffect, useState } from "react";

import { ImWarning } from "react-icons/im";
import { IoIosClose } from "react-icons/io";
import { VscLoading } from "react-icons/vsc";
import Alert from "../Alert";

import OpaqueBackground from "../OpaqueBackground";

interface DeletePopupInterface {
    open: boolean;
    text: string;
    btnText: string;
    errors?: string[];
    status: "loading" | "success" | "error" | "";
    onDelete: () => void;
    onCancel: () => void;
}

const DeletePopup = ({ open, text, btnText, status, errors, onDelete, onCancel }: DeletePopupInterface) => {
    const [texts, setTexts] = useState<{ text?: string, btnText?: string }>({})

    useEffect(() => {
        if (open)
            setTexts(txts => ({ text: text || txts.text, btnText: btnText || txts.btnText }))
    }, [open, text, btnText])

    return (
        <OpaqueBackground open={open} closeCallback={onCancel}>
            <div data-aos="fade-down" className="bg-white max-w-[720px] flex flex-col w-screen h-screen sm:max-h-[16rem] rounded-lg">
                <div className="grow flex flex-col">
                    <div className="flex gap-2 justify-between items-center rounded-t-lg bg-violet-700 text-white py-3">
                        <h1 className="text-xl mx-4 rounded-t-lg">Confirmar exclusão</h1>
                        <button onClick={onCancel} className="mx-2 hover:opacity-90 transition hover:scale-110">
                            <IoIosClose size={35} />
                        </button>
                    </div>
                    {errors?.map((message, index) => <Alert key={index} message={message} type="error" />)}
                    <div className="mx-8 my-2 grow flex items-center">
                        <div className="mr-8">
                            <ImWarning size={60} />
                        </div>
                        <div className="grow">
                            <hr className="border-zinc-600" />
                            <p className="font-thin my-2 text-zinc-700">{texts.text || ""}</p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="flex items-center justify-between gap-6 flex-wrap p-4">
                    <button type="button" onClick={onDelete} className="bg-red-600 hover:bg-red-700 hover:scale-105 text-white font-semibold px-3 transition py-2 rounded-lg">
                        {status === "loading" ? <VscLoading className="animate-spin text-lg mx-6 my-0.5" /> : texts.btnText || ""}
                    </button>
                    <button type="button" onClick={onCancel} className="py-2 transition px-4 text-zinc-800 bg-zinc-200 hover:bg-zinc-300 font-semibold rounded-lg">Cancelar</button>
                </div>
            </div>
        </OpaqueBackground>
    )
}

DeletePopup.defaultProps = {
    open: false,
    btnText: "",
    onDelete: () => { },
    onCancel: () => { }
}

export default DeletePopup;