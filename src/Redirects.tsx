import React from "react";
import { Redirect, useLocation } from "@reach/router"
import { useAuth } from "./hooks/Auth";
import validateCookies from "./utils/validateCookies"

const permissions = [
    {
        roles: ["admin"],
        route: "/admin",
        optionalFunction: (route: string) => route.startsWith("/admin")
    },
];

const RouteTreat = (route) => route.replace(new RegExp("/", 'g'), " ").trim().replace(new RegExp(" ", 'g'), "/").toLowerCase();

export function Admin({ children }) {
    const location = useLocation();
    const { cookies } = useAuth();

    const routePermissions = permissions.find(permission => permission.optionalFunction ? permission.optionalFunction(location.pathname) : RouteTreat(permission.route) === RouteTreat(location.pathname));

    let hasPermission = true;

    if (routePermissions) {
        hasPermission = validateCookies(cookies.authentication);
        hasPermission = hasPermission && routePermissions.roles.includes(cookies?.role || "");
    }
    return hasPermission ? children : <><Redirect noThrow to="/" /></>
};