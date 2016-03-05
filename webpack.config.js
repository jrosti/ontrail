module.exports = {
    entry: "./resources/public/modern/src/ontrail-main.js",
    output: {
        path: __dirname + "/resources/public/modern/js",
        filename: "ontrail-bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js/, loader: 'babel-loader', query: { presets: ['es2015'] } }
    //         { test: /\.css$/, loader: "style!css" },
    //         { test: /\.png$/, loader: "url-loader?mimetype=image/png" }
        ]
    }
};