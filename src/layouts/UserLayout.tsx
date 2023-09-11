import React, { ReactNode } from "react";

// Components
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";

type LayoutProps = {
    children: ReactNode;
    BgClass?: string;
    search_?: string;
    style?: React.CSSProperties;
}

const Index = ({ children, search_ = "", BgClass, style }: LayoutProps) => {
    return (
        <div className={`flex flex-col justify between min-h-screen ${"bg-zinc-100" || BgClass}`} style={style}>
            <Navbar search_={search_} />
            <div className="grow">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Index