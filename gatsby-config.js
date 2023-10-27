
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Personal Blog`,
    description: `This is my personal blog made using the MERN stack (MongoDB, Express, React.js and NodeJS)`,
    author: `@l3androviegas`,
    siteUrl: `https://leandroviegas.netlify.app/`,
  },
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-plugin-netlify',
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        
        color: `black`,
        showSpinner: false,
      },
    },
  ]
}
