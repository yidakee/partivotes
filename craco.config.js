module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: require.resolve('crypto-browserify'),
          assert: require.resolve('assert/'),
          stream: require.resolve('stream-browserify'),
          buffer: require.resolve('buffer/'),
        }
      }
    }
  }
};
