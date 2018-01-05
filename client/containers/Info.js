import React from 'react'
import Moves from './Moves'
import classNames from 'classnames'

class Info extends React.Component{
    
    render(){
        console.log('Info number', this.props.number)
        return(
            <div className="info">
                <div className="names">
                    <h2>{this.props.username}</h2><h2>{this.props.compUsername}</h2>
                </div>
                <div className="score">
                    <div>{this.props.scoreX}</div><div>{this.props.scoreY}</div>
                </div>

                <Moves currentNr={this.props.number} currentSign={this.props.currentSign}/>
            </div>
        )   
    }
}

export default Info;