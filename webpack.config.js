const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/evoke.js',
  output: {
    filename: 'evoke.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Evoke',
    libraryExport: "default" ,
    libraryTarget: 'umd'
  },
  optimization: {
    moduleIds: 'named',
    usedExports: false
  },
  target: 'web'
};
