import React from 'react'
import SmBoard from './SmBoard'
import {Redirect} from 'react-router'
import {Link} from 'react-router-dom'
import classNames from 'classnames'
import io from 'socket.io-client'

let socket;
let HOST = location.origin.replace(/^http/, 'ws')

class BigBoard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            board:['','','','','','','','',''],
            currentSign:'x',
            fieldIndex:-1,
            winFields:[],
            winner:'',
            freePlayers:[],
            invitations:[],
            invited:[],
            waitingForOponent:false,
            onlineSign:'',
            compSign:'',
            turn:false,
        }
        
        this.winningCases =  [[0,1,2],[3,4,5],[6,7,8],[3,4,5],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        if(props.mode==='classic' && props.username!==''){
            socket = io.connect(HOST,{query:`username=${this.props.username}`});
        }
    }
    componentDidMount = () => {
        if(this.props.mode==='classic' && this.username!==''){
            
            socket.on('get free players',({players}) => {
                this.setState({freePlayers:players})
            })
            socket.on('invite',({name}) => {
                let invitations = [...this.state.invitations,name];
                this.setState({
                    invitations,
                })
            })
            socket.on('paired',({name,ownSign}) => {
                if(ownSign==='x') this.props.setCompUsername(name);
                else this.props.setUsername(name,this.props.username);
                this.setState({
                    onlineSign:ownSign,
                    compSign: ownSign==='x' ? 'o' : 'x',
                    turn:ownSign==='x'
                })
            })
        }
    }
    findPlayer = (e) => {
        socket.emit('get free players',{query:e.target.value.toLowerCase()})
    }
    checkCombination = (winningCases,myBoard) => {
        for (var i = 0; i < winningCases.length; i++) {
          let testArray=[];
          for (var j = 0; j < winningCases[i].length; j++) {
              testArray.push(myBoard[winningCases[i][j]]);
          }
          if (testArray[0]!=='' && testArray[0]!==0 && testArray[0]===testArray[1] && testArray[0]===testArray[2]) {
            this.setState({
                winFields:winningCases[i],
                winner:testArray[0],
            })
            return true;
          }
        }
        return false
    }
    setTurn = (turn) => {
        this.setState({
            turn,
        })
    }
    setFieldIndex  = (fieldIndex) => {
        if(this.state.board[fieldIndex]!==''){
            const availableBoards = [];
            this.state.board.forEach((element,index) => {
                if(element==='') availableBoards.push(index);
            })
            return this.setState({
                fieldIndex:availableBoards,
            })
        }
        this.setState({
            fieldIndex,
        })
    }
    changeSign = () => {
        this.setState((prevState) => {
           return {currentSign:prevState.currentSign === 'x' ? 'o' : 'x'}
        })
        this.props.setCurrentSign(this.state.currentSign === 'x' ? 'o' : 'x')
    }
    invite = (name) => {
        if(this.state.invited.indexOf(name)!==-1) return;
        socket.emit('invite',{name})
        this.setState({
            invited:[...this.state.invited,name],
        })
    }
    boardFinished = (index,sign) => {
        let board = this.state.board;
        board[index]=sign;
        let scoreX=0;
        let scoreY=0;
        board.forEach((element) => {
            if(element==='x') scoreX++;
            if(element==='o') scoreY++;
        })
        this.props.getScore(scoreX,scoreY);
        this.setState({
            board,
        })
        if(this.checkCombination(this.winningCases,this.state.board)){
            console.log('somebody win the whole game')
        }
        else{
            if(this.props.counter>7){
                let winner;
                if(this.props.scoreX>this.props.scoreY){
                    winner='x';
                }
                else if(this.props.scoreX<this.props.scoreY){
                    winner='o'
                }
                else{
                    winner='nobody'
                }
                this.setState({
                    winner
                })
            }
        }
        this.props.counterAdd();
    }
    acceptInvitation = (name) => {
        this.setState({waitingForOponent:true,})
        socket.emit('accept',{name})
    }
    refreshPage = () => {
        window.location.reload();
    }
    
    render(){
        // let clickable;
        // if(this.fieldIndex===-1) clickable  = true
        let coverClasses = classNames({
            cover:true,
            active:this.state.winner!=='',
        })
        let iCoverClasses = classNames({
           cover:true,
           active: this.props.mode==='classic' && this.props.compUsername==='',
           iCover:true,
        })
        let iCover;
        if(this.props.mode==='classic'){
            iCover = (
                <div className={iCoverClasses}>
                        <input type="text" placeholder='find a player' onChange={this.findPlayer}/>
                        <div className="results">
                            <ul>
                                {
                                    this.state.freePlayers.map((player) => {
                                        let liClasses = classNames({
                                            invited:this.state.invited.indexOf(player)!==-1,
                                        })
                                        return <li className={liClasses} onClick={()=>this.invite(player)} key={player}>{player}</li> 
                                    })
                                }
                            </ul>
                        </div>
                        <div className="invitations">
                                <ul>
                                    {
                                        this.state.invitations.map((player) => {
                                            return <li onClick={()=>this.acceptInvitation(player)} key={player}>{player}</li>       
                                        })
                                    }
                                </ul>
                        </div>
                </div>
            ) 
        }
        if((this.props.mode!=='classic' && this.props.mode!=='multiplayer') || this.props.username==='') return  <Redirect to="/"/>;
        return(
            <div className="bigBoard">
                {
                    this.state.board.map((smBoard,index) => {
                        let clickable;
                        if(this.state.fieldIndex===-1) clickable  = true;
                        else if(index===this.state.fieldIndex) clickable = true;
                        else if(Array.isArray(this.state.fieldIndex)){
                            if(this.state.fieldIndex.indexOf(index)!==-1) clickable = true;
                        } 
                        else clickable = false;
                        if(this.props.compUsername==='') clickable=false;
                        if(this.state.winner) clickable = false;
                        if(this.props.mode==='classic' && !this.state.turn) clickable = false;
                        return( 
                                <SmBoard
                                key={index} 
                                setTurn={this.setTurn}
                                onlineSign={this.state.onlineSign}
                                clickable={clickable}
                                changeSign={this.changeSign} 
                                currentSign={this.state.currentSign} 
                                boardFinished={this.boardFinished} 
                                index={index}
                                finished={smBoard}
                                mode={this.props.mode}
                                setFieldIndex = {this.setFieldIndex}
                                winningSmBoard = {this.state.winFields.indexOf(index)!==-1}
                                socket ={socket}
                                />
                        )
                    })
                }
                <div className={coverClasses}>
                                <h2>{this.state.winner} won!</h2>
                                <button onClick={this.refreshPage} className='pbutton'>back</button>
                </div>
                {iCover}
            </div>
        )
    }
}

export default BigBoard;