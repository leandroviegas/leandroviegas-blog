import React from "react"
import ReactTextareaAutosize from "react-textarea-autosize"

type ValueType = string | number | readonly string[] | undefined

interface Props {
    status: "error" | "info",
    messages?: string[],
    onChange?: React.ChangeEventHandler<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement> | undefined,
    defaultValue?: ValueType,
    value?: ValueType,
    name?: string,
    label: string,
    autoComplete?: "on" | "off",
    type?: "text" | "email" | "number" | "password" | "tel" | "datetime" | "textarea" | "datetime-local" | "url" | "select",
    children?: React.ReactNode
}

const Input = ({ status, messages, onChange, defaultValue, value, name, label, type, autoComplete, children }: Props) => {
    const color = { error: "red", info: "violet" }

    const inputClassName = `block py-2.5 w-full transition duration-300 text-sm text-${status === "error" ? color[status] : "zinc"}-600 bg-transparent border-0 border-b-2 border-${status === "error" ? `${color[status]}-600` : "zinc-200"} focus:border-${color[status]}-700 focus:outline-none focus:ring-0 peer`

    const inputProps = { onChange, autoComplete, className: inputClassName, name, type, ...(value !== undefined ? { value } : { defaultValue }) }

    return (
        <>
            <div className="relative z-0">
                {type === "select" ?
                    <select {...{ ...inputProps, className: inputClassName + " pr-3" }}>
                        {children}
                    </select>
                    : type === "textarea" ?
                        <ReactTextareaAutosize {...{ ...inputProps, className: inputClassName + " px-3 rounded-lg border-2"}} placeholder=" " minRows={2} />
                : <input {...inputProps} placeholder=" " />
                }
                <label htmlFor={name} className={`absolute text-sm text-${status === "error" ? "red-600" : "zinc-500"} ${type === "textarea" ? "left-2 px-2 bg-white " : ""}peer-focus:z-10 z-10 peer-placeholder-shown:-z-10 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:text-${color[status]}-700 peer-focus:scale-75 peer-focus:-translate-y-6`}>{label}</label>
            </div>
            {messages?.map(message => <p key={name + message} id="standard_error_help" className={`mt-2 text-xs text-${status === "error" ? color[status] : "zinc"}-600`}>* {message}</p>)}
        </>
    )
}

Input.defaultProps = {
    status: "info",
    messages: [],
    autoComplete: "on",
    onChange: () => { },
    defaultValue: "",
    name: "",
    type: "text"
}

export default Input