const path = require('path')

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'stampySearch.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'stampySearch',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
}
