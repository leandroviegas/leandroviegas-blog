import React from "react";
import { navigate } from "gatsby"
import { useLocation } from "@reach/router"
import { useAuth } from "./hooks/Auth";

import { BiLoaderAlt } from "react-icons/bi"

import validateCookies from "./utils/validateCookies"

const permissions = [
    {
        roles: ["admin"],
        route: "/admin",
        valid: (route: string) => route.startsWith("/admin")
    },
];

const RouteTreat = (route) => route.replace(new RegExp("/", 'g'), " ").trim().replace(new RegExp(" ", 'g'), "/").toLowerCase();

export function Admin({ children }) {
    const location = useLocation();
    const { cookies } = useAuth();

    const routePermissions = permissions.find(permission => permission.valid ? permission.valid(location.pathname) : RouteTreat(permission.route) === RouteTreat(location.pathname));

    let hasPermission = true;

    if (routePermissions) {
        hasPermission = validateCookies(cookies?.authentication);
        hasPermission = hasPermission && routePermissions.roles.includes(cookies?.role || "");
    }

    if (typeof window !== "undefined")
        !hasPermission && navigate("/")

    return hasPermission ? children : (
        <div className="fixed h-screen w-screen top-0 left-0 flex items-center jusfify-center bg-gradient-to-b from-purple-600 to-indigo-500">
            <BiLoaderAlt className="w-[50vw] h-[50vh] max-w-[8em] animate-spin fill-zinc-800 mx-auto" />
        </div>
    )
};