const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    proxy: {
      "/api": "http://localhost:8000"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      manifest: 'public/manifest.json'
    }),
    new WorkboxPlugin.GenerateSW({
      swDest: 'service-worker.js',
      clientsClaim: true,
      skipWaiting: true,
    }),
    new WebpackPwaManifest({
      name: 'openOTOG',
      short_name: 'openOTOG',
      description: 'My awesome Progressive Web App!',
      background_color: '#ffffff',
      start_url: "/main",
      icons: [
        {
          src: resolve('public/logo.png'),
          sizes: '196x196' // multiple sizes
        }
      ]
    }),
  ],
}