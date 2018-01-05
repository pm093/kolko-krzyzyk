import React from 'react'
import {Link} from 'react-router-dom'

class UsernamePick extends React.Component{
    constructor(){
        super();
        this.state={
            username:'',
            compUsername:'',

        }
    }
   setUsername = () => {
       if(this.props.mode==='classic')
        {this.props.setUsername(this.state.username)}
       else if(this.props.mode==='multiplayer'){
           this.props.setUsername(this.state.username,this.state.compUsername);
       }

   }
    setTempUsername = (e) => {
        this.setState({
            username:e.target.value,
        })
    } 
    setTempCompUsername = (e) => {
        this.setState({
            compUsername:e.target.value,
        })
    } 
    render(){
        let optionalInput;
        optionalInput = this.props.mode === 'multiplayer' ? 
            (   <div>
                    <input type="text" placeholder='second user name' value={this.state.compUsername} onChange = {this.setTempCompUsername} />
                </div>
            )
            :
            '';
        if(this.props.mode==='') return '';
        let disabled = false;
        if(this.props.mode==='classic' && this.state.username==='') disabled=true;
        if(this.props.mode==='multiplayer' && (this.state.compUsername==='' || this.state.compUsername==='')) disabled=true;
    
        console.log(this.props.mode,disabled,this.state.username,this.state.compUsername)
        return (
            <div className="usernamePick">
                <div>
                <input type="text" value={this.state.username} placeholder='name' onChange = {this.setTempUsername} />
                </div> 
                {optionalInput}
                <div className="btn">
                <Link to='/game'><button disabled = {disabled} onClick={this.setUsername}>start</button></Link>
                </div>  
            </div>
        )
    }
}

export default UsernamePick;