import React, { createContext, ReactNode, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
    theme?: Theme;
    SwitchTheme: () => void;
}

export const ThemeContext = createContext({} as ThemeContextType);

type ThemeContextProviderProps = {
    children: ReactNode
}

export function ThemeContextProvider(props: ThemeContextProviderProps) {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        setTheme(localStorage.getItem('color-theme') === 'dark' ? 'dark' : 'light')
    }, []);

    function SwitchTheme() {
        // if set via local storage previously
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }

            // if NOT set via local storage previously
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
        setTheme(localStorage.getItem('color-theme') === 'dark' ? 'dark' : 'light')
    }
    return (
        <ThemeContext.Provider value={{ theme, SwitchTheme }}>
            {props.children}
        </ThemeContext.Provider>
    );
}