import Footer from "../Components/Footer"
import Navbar from "../Components/Navbar"

type LayoutProps = {
    children: any;
}

const Index = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col justify between min-h-screen">
            <Navbar />
            <div className="grow">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Index