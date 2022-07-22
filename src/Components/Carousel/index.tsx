import React, { RefObject, useEffect, useState } from "react";

import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs"

type CarouselProps = {
    children: any;
}

const Index = ({ children }: CarouselProps) => {

    const Slide: RefObject<HTMLDivElement> = React.createRef();

    const [slideProps, setSlideProps] = useState<{ clientWidth: number, scrollWidth: number, scrollLeft: number }>({
        clientWidth: 0,
        scrollLeft: -1,
        scrollWidth: 0
    })

    const SlideRight = () => {
        Slide.current?.scrollTo({ left: Slide.current?.scrollLeft + (Slide.current.clientWidth * 0.80), behavior: "smooth" })
    }
    const SlideLeft = () => {
        Slide.current?.scrollTo({ left: Slide.current?.scrollLeft - (Slide.current.clientWidth * 0.80), behavior: "smooth" })
    }

    const HandleSetSlideProps = () => setSlideProps({
        clientWidth: Slide.current?.clientWidth || 0,
        scrollLeft: Slide.current?.scrollLeft || 0,
        scrollWidth: Slide.current?.scrollWidth || 0
    })

    return (
        <>
            <span onScroll={HandleSetSlideProps} ref={Slide} className="carousel flex overflow-x-auto">
                {children}
            </span>
            <div className="sm:h-0">
                <div className="sm:-translate-y-full relative z-10 sm:h-48 flex justify-between sm:bg-transparent">
                    {slideProps.scrollLeft > 0 ?
                        <button className="h-full sm:w-32 sm:bg-gradient-to-r from-black/70 flex items-center text-3xl text-black sm:text-white px-4 py-3"><BsFillArrowLeftCircleFill onClick={SlideLeft} /></button>
                        : <div></div>
                    }
                    {slideProps.scrollLeft < (slideProps.scrollWidth - slideProps.clientWidth) ?
                        <button className="h-full sm:w-32 sm:bg-gradient-to-l from-black/70 flex items-center text-3xl text-black sm:text-white px-4 py-3 justify-end"><BsFillArrowRightCircleFill onClick={SlideRight} /></button>
                        : <div></div>
                    }
                </div>
            </div>
        </>
    )
}

export default Index