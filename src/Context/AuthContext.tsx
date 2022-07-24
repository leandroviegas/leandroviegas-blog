import { createContext, ReactNode, useEffect, useState } from "react";
import api, { authorization } from "../Services/api";

type User = {
    username: string;
    email: string;
    profilePicture?: string;
    admin: boolean;
}

type AuthContextType = {
    userInfo?: User;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signIn: (usernameOrEmail: string, password: string) => Promise<void>;
    signUp: (username: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

type AuthContextProviderProps = {
    children: ReactNode
}

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [userInfo, setUserInfo] = useState<User>()

    useEffect(() => {
        if (localStorage.getItem('token'))
            api.get("/login", { headers: { authorization } }).then(response => {
                setUserInfo(response.data.user);
            }).catch(err => { console.error(err) })
    }, [])

    async function signInWithGoogle() {

    }

    async function signUp(username: string, email: string, password: string) {
        return api.post("/users", { username, password, email, link: username, profilePicture: "" }).then(() => {
            return api.post("/login", { usernameOrEmail: username, password }).then(response => {
                setUserInfo(response.data.user);
                localStorage.setItem("token", response.data.token);
            }).catch(err => { console.error(err); throw err })
        }).catch(err => { console.error(err); throw err })
    }

    async function signIn(usernameOrEmail: string, password: string) {
        return api.post("/login", { usernameOrEmail, password }).then(response => {
            setUserInfo(response.data.user);
            localStorage.setItem("token", response.data.token);
        }).catch(err => { console.error(err); throw err; })
    }

    async function signOut() {
        setUserInfo(undefined);
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{ userInfo, signInWithGoogle, signUp, signIn, signOut }}>
            {props.children}
        </AuthContext.Provider>
    );
}