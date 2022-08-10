import React from "react";

import { AuthContextProvider } from "./src/context/AuthContext";

// style imports
import 'suneditor/dist/css/suneditor.min.css';
import "./src/css/index.css";
import "./src/css/tailwind.css";

export const wrapRootElement = ({ element }) => {
    return (
        <AuthContextProvider>
            {element}
        </AuthContextProvider>
    );
}