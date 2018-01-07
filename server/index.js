import express from 'express'
import path from 'path'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackConfig from '../webpack.config'
import http from 'http'
import _ from 'lodash'
const socketServer = require('socket.io');

const app = express();

app.use(webpackMiddleware(webpack(webpackConfig)));

app.use(express.static(path.join(__dirname,'public')))


app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'))
})

const server = http.createServer(app);
const io = socketServer(server);
let connections = {};
let freePlayers = {};
let pairs = {};
io.on('connection',(socket) => {
  connections[socket.handshake.query.username] = socket.id;
  freePlayers[socket.handshake.query.username] = socket.id;
  console.log('socket connected', connections)
  let username = socket.handshake.query.username;
  socket.on('disconnect',() => {
    connections = _.omit(connections,socket.handshake.query.username);
    freePlayers = _.omit(freePlayers,socket.handshake.query.username);
    pairs = _.omit(pairs,username)
    pairs = _.omitBy(pairs,value => {if(value===username) return false; else{ return true}})
    console.log('polaczenia odjecie',connections);
  })

  socket.on('get free players',({query}) => {
    console.log(query)
    let players = Object.keys(freePlayers).filter((player) => {
      return player.toLowerCase().indexOf(query)!==-1 && player !==socket.handshake.query.username;
    })
    socket.emit('get free players',{players})
  })

  socket.on('invite',({name}) => {
    socket.broadcast.to(connections[name]).emit('invite',{name:socket.handshake.query.username});
  })

  socket.on('accept',({name}) => {
    console.log('accept, name:', name)
    if(pairs.hasOwnProperty(name) || Object.values(pairs).indexOf(socket.handshake.query.username)!==-1){
      return;
    }
    pairs[name] = username;
    pairs[username] = name;
    socket.emit('paired',{name,ownSign:'o'});
    socket.broadcast.to(connections[name]).emit('paired',{name:username,ownSign:'x'})
    console.log(pairs)
  })

  socket.on('move',({smIndex,field}) => {
    socket.broadcast.to(connections[pairs[username]]).emit('move',{smIndex,field})
  })
})

server.listen(process.env.PORT || 3001);
