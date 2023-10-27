import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import api from "@services/api";
import { User } from "@classes/blog";
import validateCookies from "@utils/validateCookies";

type AuthContextType = {
    user?: User;
    cookies: {
        authentication?: any;
        role?: any;
    };
    signOut: () => Promise<void>;
    signIn: (usernameOrEmail: string, password: string) => Promise<void>;
    signUp: (username: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

type AuthContextProviderProps = {
    children: ReactNode
}

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>()

    const [cookies, setCookie, removeCookie] = useCookies(['authentication', "role"]);

    const location = typeof window !== "undefined" ? window.location : { pathname: "",search: "" };

    useEffect(() => {
        const google_token_string = new URLSearchParams(location.search ?? "").get('token') || "{}";
        const google_token: {
            token: string,
            user: {
                id: string,
                username: string,
                email: string,
                profilePicture: string,
                role: string
            }
        } = JSON.parse(google_token_string)

        if (google_token?.token && typeof window !== 'undefined') {
            setCookie("authentication", google_token.token, { path: '/' });
            window.history.pushState({}, document.title, location.pathname);
        }

        if (cookies.authentication || google_token?.token) {
            if (validateCookies(cookies.authentication || google_token?.token)) {
                api.get("/login", { headers: { authorization: `Bearer ${cookies.authentication || google_token.token}` } }).then(response => {
                    setUser(response.data.user);
                    setCookie("role", response.data.user.role, { path: '/' });
                }).catch(err => { console.error(err) })
            } else {
                signOut();
            }
        } else {
           signOut();
        }
    }, [])

    async function signIn(usernameOrEmail: string, password: string) {
        return api.post("/login", { usernameOrEmail, password }).then(response => {
            setUser(response.data.user);
            setCookie("role", response.data.user.role, { path: '/' });
            setCookie("authentication", response.data.token, { path: '/' });
        }).catch(err => { console.error(err); throw err; })
    }

    async function signUp(username: string, email: string, password: string) {
        return api.post("/users", { username, password, email, link: username, profilePicture: "" }).then(() => {
            return signIn(username, password)
        }).catch(err => { console.error(err); throw err })
    }

    async function signOut() {
        setUser(undefined);
        removeCookie("authentication", { path: '/' });
        removeCookie("role", { path: '/' });
    }

    return (
        <AuthContext.Provider value={{ user, cookies, signUp, signIn, signOut }}>
            {props.children}
        </AuthContext.Provider>
    );
}