import { Helmet } from "react-helmet-async"
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
            <Helmet>
                <title>Leandro Viegas | Blog</title>
            </Helmet>
            <div className="container mx-auto">

                {categories.map(category => {
                    return (
                        <div className="my-5" key={category.name}>
                            <h1 className="text-2xl font-semibold text-zinc-700">{category.name}</h1>
                            <div className="my-5">

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