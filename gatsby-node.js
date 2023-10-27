const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        resolve: {
            alias: {
                '@components': path.resolve(__dirname, 'src/components'),
                '@images': path.resolve(__dirname, 'src/images'),
                '@layouts': path.resolve(__dirname, 'src/layouts'),
                '@styles': path.resolve(__dirname, 'src/styles'),
                '@services': path.resolve(__dirname, 'src/services'),
                '@classes': path.resolve(__dirname, 'src/classes'),
                '@utils': path.resolve(__dirname, 'src/utils'),
                '@context': path.resolve(__dirname, 'src/context'),
                '@hooks': path.resolve(__dirname, 'src/hooks'),
            }
        }
    })
}   