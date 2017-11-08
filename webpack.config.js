var webpack = require('webpack');
var path = require('path');

module.exports={
  entry:path.join(__dirname,'/src/index.js'),
  output:{
    path:__dirname,
    filename:'bundle.js',
    publicPath:'/'
  },
  devtool:'eval',
  module:{
   rules:[
     {
       test:/\.jsx?$/,
       loader:'babel-loader',
       exclude:path.join(__dirname,'node_modules')
     },
     {
       test:/\.scss$/,
       loader:['style-loader','css-loader','sass-loader']
     },
   ]
 },

}
