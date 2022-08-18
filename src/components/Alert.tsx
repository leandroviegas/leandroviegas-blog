import React, { memo } from "react";

import { VscError } from "react-icons/vsc";
import { GrStatusGood } from "react-icons/gr";

export type AlertProps = {
    message: string;
    type: "success" | "error" | "warning";
}

const Alert = ({ message, type }: AlertProps) => {
    return (
        <>
            {type === "error" &&
                <div className="rounded gap-2 text-white text-sm py-1 px-2 bg-red-500 flex items-center">
                    <VscError className="stroke-1 text-lg" />
                    <span className="font-thin">{message}</span>
                </div>
            }

            {type === "success" &&
                <div className="rounded gap-2 text-white text-sm py-1 px-2 bg-green-500 flex items-center">
                    <GrStatusGood className="stroke-1 text-lg" />
                    <span className="font-thin">{message}</span>
                </div>
            }
        </>
    )
}

export default memo(Alert);