const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    content: './ces/src/js/entries/content.js',
    background: './ces/src/js/entries/background.js',
    popup: './ces/src/js/entries/popup.js',
    options: './ces/src/js/entries/options.js'
  },
  output: {
    path: path.resolve(__dirname, './ces/dist/js'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  resolve: {
    modules: ['ces/src', 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
};
