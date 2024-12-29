const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": false,
    "https": false,
    "url": false,
    "util": false,
    "zlib": false,
    "stream": false,
    "crypto": false,
    "buffer": false,
    "process": false,
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:3001/api')
    })
  ]);

  return config;
}