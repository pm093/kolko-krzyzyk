import React from 'react'
import BigBoard from './BigBoard'
import Info from './Info'
import ModeChoice from './ModeChoice'
import UsernamePick from './UsernamePick.jsx'
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
} from 'react-router-dom'

import '../../server/public/style.css'

class App extends React.Component{
  constructor(){
    super()
    this.state={
      number:0,
      currentSign:'x',
      username:'',
      compUsername:'',
      mode:'',
      scoreX:0,
      scoreY:0,
      
    }
  }
  setMode = (mode) => {
    this.setState({
      mode,
    })
  }
  setUsername = (username,compUsername='') => {
    this.setState({
      username,
      compUsername
    })
  }
  setCompUsername = (compUsername) => {
    this.setState({
      compUsername,
    })
  }
  
  counterAdd = () => {
    this.setState({
      number:this.state.number+1,
    })
  }
  setCurrentSign = (sign) => {
    this.setState({
      currentSign:sign,
    })
  }
  getScore = (scoreX,scoreY) => {
    this.setState({
      scoreX,
      scoreY
    })
  }
  render(){
    console.log(this.props.username,this.props.compUsername)
    return(
      <Router>
        <div className="container">
          <Route exact path='/game' render={()=><Info scoreX={this.state.scoreX} scoreY = {this.state.scoreY} mode={this.state.mode} username={this.state.username} compUsername={this.state.compUsername} number={this.state.number} currentSign={this.state.currentSign}/>}/>
          <Route exact path='/game' render={()=><BigBoard setUsername={this.setUsername} setCompUsername={this.setCompUsername} username={this.state.username} compUsername = {this.state.compUsername} getScore={this.getScore} counterAdd={this.counterAdd} setCurrentSign={this.setCurrentSign} mode={this.state.mode}/>}/>
          <Route exact path='/' render={()=><ModeChoice mode={this.state.mode}  setMode = {this.setMode} setUsername={this.setUsername}/>}/>
          
        </div> 
      </Router>
    )
  }
}

export default App;
