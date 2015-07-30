var webpack = require('webpack');
var config = require('./webpack.config');

webpack(config).run(function webpackRun(err, res) {
  console.log(err, res);
});

var WebpackDevServer = require('webpack-dev-server');
new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});
