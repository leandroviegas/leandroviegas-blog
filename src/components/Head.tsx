import React from "react"
import { Helmet } from 'react-helmet'
import PropTypes from "prop-types"

function Head({ title, description, author, lang, image, children }) {
    console.log(image)

    return (
        <Helmet htmlAttributes={{ lang }}>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={image} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:creator" content={author} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="robots" content="all" />
            {children}
        </Helmet>
    )
}

Head.defaultProps = {
    description: ``,
    author: ``,
    image: ``,
    children: ``,
    lang: `pt-br`,
}

Head.propTypes = {
    lang: PropTypes.string,
    author: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    title: PropTypes.string.isRequired,
}

export default Head