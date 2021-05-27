const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/fireflies.js',
  output: {
    filename: 'fireflies.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Fireflies',
    libraryExport: "default" ,
    libraryTarget: 'umd'
  },
  optimization: {
    moduleIds: 'named',
    usedExports: false
  },
  target: 'web'
};
