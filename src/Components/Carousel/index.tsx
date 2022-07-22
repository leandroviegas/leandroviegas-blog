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
        Slide.current?.scrollTo({ left: Slide.current?.scrollLeft + (Slide.current.clientWidth * 0.66), behavior: "smooth" })
    }
    const SlideLeft = () => {
        Slide.current?.scrollTo({ left: Slide.current?.scrollLeft - (Slide.current.clientWidth * 0.66), behavior: "smooth" })
    }

    const HandleSetSlideProps = () => setSlideProps({
        clientWidth: Slide.current?.clientWidth || 0,
        scrollLeft: Slide.current?.scrollLeft || 0,
        scrollWidth: Slide.current?.scrollWidth || 0
    })

    return (
        <>
            <div className="h-0">
                <div className="relative z-10 h-48 flex justify-between">
                    {slideProps.scrollLeft > 0 ?
                        <div className="h-full w-32 bg-gradient-to-r from-black/70 flex items-center text-3xl text-white p-4"><BsFillArrowLeftCircleFill onClick={SlideLeft} /></div>
                        : <div></div>
                    }
                    {slideProps.scrollLeft < (slideProps.scrollWidth - slideProps.clientWidth) ?
                        <div className="h-full w-32 bg-gradient-to-l from-black/70 flex items-center text-3xl text-white p-4 justify-end"><BsFillArrowRightCircleFill onClick={SlideRight} /></div>
                        : <div></div>
                    }
                </div>
            </div>
            <div onScroll={HandleSetSlideProps} ref={Slide} className="flex overflow-x-hidden">
                {children}
            </div>
        </>
    )
}

export default Index