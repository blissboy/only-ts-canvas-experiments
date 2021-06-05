// const path = require('path');
//
// module.exports = {
//     entry: './index.ts',
//     devtool: 'inline-source-map',
//     module: {
//         rules: [
//             {
//                 test: /\.tsx?$/,
//                 use: 'ts-loader',
//                 exclude: /node_modules/,
//             },
//         ],
//     },
//     resolve: {
//         extensions: [ '.tsx', '.ts', '.js','ts.d' ],
//     },
//     output: {
//         filename: 'bundle.js',
//         path: path.resolve(__dirname, 'dist'),
//     },
//     node: {
//         fs: 'empty',
//     }
// };

const path = require('path');

module.exports = {
    entry: './index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};