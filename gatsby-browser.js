import React from "react";
import { LocationProvider } from "@reach/router"

import { AuthContextProvider } from "./src/context/AuthContext";
import RedirectProvider from "./src/Redirects";

// style imports
import 'suneditor/dist/css/suneditor.min.css';
import "./src/css/index.css";
import "./src/css/tailwind.css";

export const wrapRootElement = ({ element }) => {
    return (
        <AuthContextProvider>
            <LocationProvider>
                <RedirectProvider>
                    {element}
                </RedirectProvider>
            </LocationProvider>
        </AuthContextProvider>
    );
}