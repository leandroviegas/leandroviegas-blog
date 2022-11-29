import React from "react"
import layeredWaves from "../images/layered-waves-haikei.svg"

const Index = () => {
    return (
        <>
            <img className="w-full select-none" unselectable="on" src={layeredWaves} alt="" />
            <footer style={{ backgroundColor: "#693cdf" }} className="w-full">
                <div className="container mx-auto flex justify-between py-5">
                </div>
            </footer>
        </>
    )
}

export default Index