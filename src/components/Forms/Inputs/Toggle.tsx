import React, { ChangeEventHandler } from "react"

interface ToggleProps {
    defaultChecked?: boolean,
    checked?: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined,
    name?: string,
    label?: string
}

const Toggle = ({ defaultChecked, checked, name, label, onChange }: ToggleProps) => {
    return (
        <label htmlFor={name} className="inline-flex relative items-center cursor-pointer">
            <input {...{ onChange, ...(checked !== undefined ? { checked } : { defaultChecked }) }} type="checkbox" id={name} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
    )
}

export default Toggle