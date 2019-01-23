const path = require('path');
const fs = require('fs');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const WebpackOnBuildPlugin = require('on-build-webpack');

module.exports = {
  mode: "development",
  //tell to webpack that we work on server
  target: 'web',
  //tell our entry point (our start file)
  entry: {
    index: [
      "./src/index.js"
    ]
  },
  //tell to webpack where we will build our files
  output: {
    filename: 'client_bundle.[hash:8].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build'
  },
  //connect modules to our webpack. This will allow to work with all neaded extensions
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {          
          loader: 'babel-loader'        
        },
        exclude: '/node-modules/'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
        exclude: '/node-modules/'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        exclude: '/node-modules/'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|png|jpg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 2192,
            fallback: "file-loader",
            
            // Below are the fallback options
            name: "[name].[ext]",
            publicPath: (url, resourcePath, context) => {
              const ext = path.extname(url).slice(1);

              return `/assets/${ext}/${url}`
            },
            outputPath: (url, resourcePath, context) => {
              const ext = path.extname(url).slice(1);

              return `/assets/${ext}/${url}`
            }
          }
        },
        exclude: '/node-modules/'
      }
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 3100,
      proxy: 'http://localhost:3000/'
    }),
    new WebpackOnBuildPlugin((stats) => { 
      const newlyCreatedAssets = stats.compilation.assets; 
      let newlyJS;

      for (let key in newlyCreatedAssets) {
        if (path.extname(newlyCreatedAssets[key].existsAt) === '.js') {
          newlyJS = path.basename(newlyCreatedAssets[key].existsAt);
        }
      }

      const unlinked = []; 
      const buildDir = path.join(__dirname, 'build');

      fs.readdir(buildDir, (err, files) => { 
        files
          .filter(item => item.search('client_bundle') >= 0)
          .forEach(file => { 
            if (newlyJS && file !== newlyJS) {
              fs.unlinkSync(path.join(buildDir, file)); 
              unlinked.push(file); 
            } 
          }); 
        if (unlinked.length > 0) { 
          console.log('Removed old assets: ', unlinked); 
        } 
      })
    })
  ]
}