module.exports = {
  entry: {
    content: './ces/lib/content.js',
    background: './ces/lib/background.js'
  },
  output: {
    path: './ces/dist',
    filename: '[name].js'
  },
  devtool: 'source-map'
};
