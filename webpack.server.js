const path = require('path');
const fs = require('fs');
const webpackNodeExternals = require('webpack-node-externals');
const WebpackOnBuildPlugin = require('on-build-webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  //tell to webpack that we work on server
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  //tell our entry point (our start file)
  entry: {
    index: [
      "./server.js"
    ]
  },
  //tell to webpack where we will build our files
  output: {
    filename: 'bundle.js',
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
          //for client:
          //'style-loader',
          //for node.js
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/build'
            }
          },
          'css-loader',
          'sass-loader'
        ],
        exclude: '/node-modules/'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/build'
            }
          },
          'css-loader'
        ],
        exclude: '/node-modules/'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|png|jpg|gif|ico)$/,
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
      },
      { 
        test: /\.json$/, 
        loader: "json-loader" 
      },
      { 
        test: /\.txt$/, 
        loader: "raw-loader" 
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.[hash:8].css"
    }),
    new WebpackOnBuildPlugin((stats) => { 
      const newlyCreatedAssets = stats.compilation.assets; 
      let newlyCSS;

      for (let key in newlyCreatedAssets) {
        if (path.extname(newlyCreatedAssets[key].existsAt) === '.css') {
          newlyCSS = path.basename(newlyCreatedAssets[key].existsAt);
        }
      }

      const unlinked = []; 
      const buildDir = path.join(__dirname, 'build');

      fs.readdir(buildDir, (err, files) => { 
        files
          .filter(item => item.search('main') >= 0)
          .forEach(file => { 
            if (newlyCSS && file !== newlyCSS) {
              fs.unlinkSync(path.join(buildDir, file)); 
              unlinked.push(file); 
            } 
          }); 
        if (unlinked.length > 0) { 
          console.log('Removed old assets: ', unlinked); 
        } 
      })
    })
  ],
  externals: [webpackNodeExternals()]
}