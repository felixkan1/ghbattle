const path = require ('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_budle.js',
    publicPath: '/'
  },
    module: {
      rules: [
        { test: /\.(js)$/, use: 'babel-loader' },
        { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]}
      ]
    },
    devServer: {
      historyApiFallback: true,
    },
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    })
  ]
}
