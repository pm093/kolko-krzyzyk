var webpack = require('webpack');
var path = require('path');

module.exports={
  entry:path.join(__dirname,'/client/index.js'),
  output:{
    path:path.join(__dirname,'server'),
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
       test:/\.css$/,
       loader:['style-loader','css-loader']
     },
   ]
 },

}
