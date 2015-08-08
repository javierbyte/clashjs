var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    './src/Index.jsx'
  ],
  devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
  output: {
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: ['babel']
    }]
  },
  devServer: {
      contentBase: './',
      noInfo: true, //  --no-info option
      hot: true,
      inline: true
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
