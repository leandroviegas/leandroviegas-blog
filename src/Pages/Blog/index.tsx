import Carousel from "../../Components/Carousel"
import Layout from "../../Layouts/Layout"


const Index = () => {

    const categories = [
        {
            name: "React",
            description: ""
        },
        {
            name: "Programming",
            description: ""
        },
        {
            name: "Design",
            description: ""
        }
    ]

    return (
        <Layout>
            <div className="container mx-auto">

                {categories.map(category => {
                    return (
                        <div className="my-5" key={category.name}>
                            <h1 className="text-2xl font-semibold text-zinc-700">{category.name}</h1>
                            <div className="my-5">
                                <Carousel>
                                    {[1, 2, 1, 2, 1, 2, 1, 2].map((i, index) =>
                                        <div key={index} className="h-48 shrink-0 mr-3">
                                            <img className="h-full" src="/images/placeholder.jpg" alt="" />
                                        </div>
                                    )}
                                </Carousel>
                            </div>
                            <hr />
                        </div>
                    )
                })}
            </div>
        </Layout>
    )
}

export default Index