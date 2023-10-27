import React, { createContext, ReactNode, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme?: Theme;
  SwitchTheme: () => void;
};

export const ThemeContext = createContext({} as ThemeContextType);

type ThemeContextProviderProps = {
  children: ReactNode;
};

export function ThemeContextProvider(props: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    localStorage.getItem("color-theme") == "light" ? "light" : "dark"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  function SwitchTheme() {
    // if set via local storage previously
    let localTheme: Theme = ["light", "dark"].includes(localStorage.getItem("color-theme"))
      ? (localStorage.getItem("color-theme") as Theme)
      : "light";

    localTheme = localTheme === "light" ? "dark" : "light";

    localStorage.setItem("color-theme", localTheme);
    setTheme(localTheme);
  }
  return (
    <ThemeContext.Provider value={{ theme, SwitchTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}
