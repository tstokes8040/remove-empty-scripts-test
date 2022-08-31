const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require('path');
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const sortMediaQueries = require( 'postcss-sort-media-queries' );
const presetEnv = require( 'postcss-preset-env' );
const mergeLonghand = require( 'postcss-merge-longhand' );
const mergeRules = require( 'postcss-merge-rules' );
const cssnano = require( 'cssnano' );
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

const jsConfig = {
    ...defaultConfig,
    name: 'jsConfig',
    entry: {
        'main': path.resolve( './src/js', 'main.js' ),
    },
    output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'build/js')
	}
}

const styleConfig = {
    entry: {
        'main': path.resolve( './src/sass', 'main.scss' ),
    },
    module: {
        rules: [
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader",
                    options: {
                        url: false, //Don't do anything with image url's
                    },
                },
                {
                    loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                            plugins: [
                                sortMediaQueries(),
                                presetEnv(),
                                mergeLonghand(),
                                mergeRules(),
                                cssnano( {
                                    reduceIdents: false,
                                    zindex: false,
                                    autoprefixer: false,
                                } ),
                            ],
                            options: {},
                        },
                     },
                },
                'resolve-url-loader',
                'sass-loader',
            ],
        },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'build/css'),
    },
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin(),
        new DependencyExtractionWebpackPlugin(),
        new RemoveEmptyScriptsPlugin(),
    ]
}

module.exports = [
    jsConfig,
    styleConfig
]
