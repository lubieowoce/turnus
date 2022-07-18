const path = require('path');

module.exports = {
  target: 'node18',
  entry: './src/server.ts',
  devtool: 'inline-source-map',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    moduleIds: 'deterministic',
  }
};