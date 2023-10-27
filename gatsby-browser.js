import React from "react";

import { AuthContextProvider } from "./src/context/AuthContext";
import { ThemeContextProvider } from "./src/context/ThemeContext";

// style imports
import 'suneditor/dist/css/suneditor.min.css';
import "./src/styles/index.css";
import "./src/styles/tailwind.css";
import "aos/dist/aos.css";

import AOS from "aos"
AOS.init();

export const wrapRootElement = ({ element }) => {
    if (
        localStorage.getItem('color-theme') === 'dark' ||
        (!('color-theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    return (
        <ThemeContextProvider>
            <AuthContextProvider>
                {element}
            </AuthContextProvider>
        </ThemeContextProvider>
    );
}