const path = require('path')

module.exports = {
  entry: './src/script.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: {
    Animation: 'commonjs Animation',
    Diagnostics: 'commonjs Diagnostics',
    FaceTracking: 'commonjs FaceTracking',
    Reactive: 'commonjs Reactive',
    Scene: 'commonjs Scene',
    Time: 'commonjs Time',
    TouchGestures: 'commonjs TouchGestures'
  }
}
