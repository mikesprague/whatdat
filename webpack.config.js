const path = require('path');
const WebPackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const mode = process.env.WEBPACK_SERVE ? 'development' : 'production';

const webpackRules = [
  {
    test: /\.(sa|sc|c)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins() {
            return [
              autoprefixer(),
              cssnano({
                preset: 'default',
              }),
              purgecss({
                content: ['./src/*.html', './src/js/modules/templates.js'],
                fontFace: true,
                // whitelistPatterns: [//],
              }),
            ];
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  },
  {
    test: /\.(js)$/,
    exclude: [/node_modules/],
    use: [{
      loader: 'babel-loader',
    }],
  },
];

const webpackPlugins = [
  new WebPackBar(),
  new MiniCssExtractPlugin({
    filename: './css/styles.css',
    chunkFilename: './css/[id].css',
  }),
  new CopyWebpackPlugin([{
    from: './src/*.js*',
    to: './',
    flatten: true,
    force: true,
  }]),
  new CopyWebpackPlugin([{
    from: './src/_redirects',
    to: './',
    force: true,
  }]),
  new CopyWebpackPlugin([{
    from: './src/images/**/*',
    to: './images',
    flatten: true,
    force: true,
  }]),
  new CopyWebpackPlugin([{
    from: './src/*.html',
    to: './',
    force: true,
    flatten: true,
  }]),
];

if (mode === 'production') {
  webpackPlugins.push(
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  );
}

module.exports = {
  entry: [
    './src/js/app.js',
  ],
  devtool: 'source-map',
  output: {
    filename: './js/bundle.js',
    chunkFilename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode,
  module: {
    rules: webpackRules,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  },
  plugins: webpackPlugins,
};
