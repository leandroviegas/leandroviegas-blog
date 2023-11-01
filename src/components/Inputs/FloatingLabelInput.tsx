import React from "react"
import ReactTextareaAutosize from "react-textarea-autosize"

type ValueType = string | number | readonly string[] | undefined

class InputProps implements React.InputHTMLAttributes<HTMLInputElement> {
    status?: "error" | "info";
    messages?: string[];
    onChange?: React.ChangeEventHandler<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement> | undefined;
    defaultValue?: ValueType;
    value?: ValueType;
    name?: string;
    label: string;
    readOnly?: boolean;
    autoComplete?: "on" | "off";
    type?: "text" | "email" | "number" | "password" | "tel" | "datetime" | "textarea" | "datetime-local" | "url" | "select";
    children?: React.ReactNode;
}

function Input({ status = "info", messages, onChange, defaultValue, value, name, label, type, autoComplete, children, readOnly }: InputProps) {
    const color = { error: "red", info: "indigo" }

    const inputClassName = `block py-2.5 w-full transition duration-300 text-sm text-${status === "error" ? color[status] : "zinc"}-600 dark:text-${status === "error" ? color[status] : "zinc"}-300 bg-transparent border-0 border-b-2 border-${status === "error" ? `${color[status]}-600` : "zinc-200"} focus:border-${color[status]}-700 focus:outline-none focus:ring-0 peer`
    
    let inputProps: any = { onChange, readOnly, autoComplete, className: inputClassName, name, type }

    if(value)
        inputProps.value = value

    if(defaultValue)
        inputProps.defaultValue = defaultValue

    return (
        <>
            <div className={`relative ${type === "textarea" ? "dark:bg-zinc-800" : ""} z-0`}>
                {type === "select" ?
                    <select {...{ ...inputProps, className: inputClassName + " pr-3" }}>
                        {children}
                    </select>
                    : type === "textarea" ?
                        <ReactTextareaAutosize {...{ ...inputProps, className: inputClassName + " px-3 rounded-lg border-2" }} placeholder=" " minRows={2} />
                        : <input {...inputProps} placeholder=" " />
                }
                <label htmlFor={name} id={name} className={`absolute text-sm text-${status === "error" ? "red-600" : "zinc-500"} rounded dark:text-${status === "error" ? "red-600" : "zinc-400"} ${type === "textarea" ? "left-2 px-2 bg-white dark:bg-zinc-800 " : ` peer-focus:text-${color[status]}-700 darkpeer-focus:text-${color[status]}-400 `}peer-focus:z-10 z-10 peer-placeholder-shown:-z-10 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>{label}</label>
            </div>
            {messages?.map(message => <p key={name + message} id="standard_error_help" className={`mt-2 text-xs text-${status === "error" ? color[status] : "zinc"}-600 dark:text-${status === "error" ? color[status] : "zinc"}-400`}>* {message}</p>)}
        </>
    )
}

export default Input