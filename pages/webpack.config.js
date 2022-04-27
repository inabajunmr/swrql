const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/js/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public/js')
  },
  resolve: {
    fallback: {
        buffer: require.resolve('buffer/'),
    },
},  
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    })
  ],  
  module: {
    rules: [
        {
            test: /\.ts$/,
            loader: 'ts-loader'
        }
    ],
},
resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      stream: "stream-browserify",
    }
}};
