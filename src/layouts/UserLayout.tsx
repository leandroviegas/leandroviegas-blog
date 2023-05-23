import React from "react";

// Components
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

type LayoutProps = {
    children: any;
    BgClass?: string;
    search_?: string;
}

const Index = ({ children, search_ = "", BgClass }: LayoutProps) => {
    return (
        <div className={`flex flex-col justify between min-h-screen ${BgClass ?? "bg-zinc-100"}`}>
            <Navbar search_={search_} />
            <div className="grow">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Index