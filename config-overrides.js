// config-overrides.js
const webpack = require('webpack');

module.exports = function override(config) {
  // Polyfills for Node.js core modules in browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "buffer": require.resolve("buffer"),
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify"),
    "assert": require.resolve("assert"),
    "stream": require.resolve("stream-browserify"),
    "process": require.resolve("process/browser"),
  };
  
  // Add plugins
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ];
  
  return config;
};
