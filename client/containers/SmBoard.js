import React from 'react';
import classNames from 'classnames'


class SmBoard extends React.Component{
  constructor(props){
    super(props);
    this.state={
      board:['','','','','','','','',''],
      winFields:[],
    }
    this.winningCases =  [[0,1,2],[3,4,5],[6,7,8],[3,4,5],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.counter = 0;
  }
  componentDidMount(){
    if(this.props.mode==='classic'){
      this.props.socket.on('move',({field,smIndex}) => {
        if(this.props.index!==smIndex) return;
        this.counter++;
        const board = this.state.board;
        board[field]=this.props.onlineSign==='x' ? 'o' : 'x';
        this.setState({
          board,
        })
        this.checkOnlineGame(board)
        this.props.setFieldIndex(field);
        this.props.setTurn(true)
      })
    }
  }
  checkCombination(winningCases,myBoard){
    for (var i = 0; i < winningCases.length; i++) {
      let testArray=[];
      for (var j = 0; j < winningCases[i].length; j++) {
          testArray.push(myBoard[winningCases[i][j]]);
      }
      if (testArray[0]!=='' && testArray[0]===testArray[1] && testArray[0]===testArray[2]) {
        this.setState({
          winFields:winningCases[i],
        })
        return testArray[0];
      }
    }
    return false
  }
  handleOnlineModeClick = (index,smIndex) => {
    console.log('online mode click')
    this.counter++;
    if(!this.props.clickable) return false;
    if (this.state.board[index]===''){
      const board = this.state.board;
      board[index] = this.props.onlineSign;
      if(!this.checkOnlineGame(board)){
        this.setState((prevState) => ({
          board:board,
        }))
      }
      this.props.socket.emit('move',{field:index,smIndex})
    }
  
    this.props.setFieldIndex(index);
    this.props.setTurn(false)
  }
  checkOnlineGame(board){
    let checkCombination = this.checkCombination(this.winningCases,board);
      if (checkCombination){
        this.props.boardFinished(this.props.index,checkCombination)
        return true;
      }
      else if(this.counter>8) {
        this.props.boardFinished(this.props.index,0)
        return true;
      }
      else{
        return false;
      }
  }
  handleSquareClick(index) {
    if(!this.props.clickable) return false;
    if (this.state.board[index]==='') {
      // const counter = this.state.counter + 1;
      const board = this.state.board;
      this.counter++;
      board[index] = this.props.currentSign;
      let checkCombination = this.checkCombination(this.winningCases,board);
      if (checkCombination){
        this.props.boardFinished(this.props.index,checkCombination)
      }
      else if(this.counter>8) {
        this.props.boardFinished(this.props.index,0)
      }
      else{
        this.setState((prevState) => ({
          board:board,
        }))
      }
   
    this.props.changeSign();
    this.props.setFieldIndex(index);
    }
  }
  
  render(){
    let classes = classNames({
      cover:true,
      cross:this.props.finished === 'x',
      circle:this.props.finished === 'o',
      unmatched:this.props.finished === 0
    })
    let boardClasses = classNames({
      smBoard:true,
      clickable:this.props.clickable,
      winningBoard: this.props.winningSmBoard,
    })
    
    let info;
    info = this.props.finished === 0 ? 'unmatched' : ''; 
    return(
          <div className={boardClasses}>
            {this.state.board.map((field,index) => {
              let toShow;
              if(field==='o') toShow = <i className="fa fa-circle-o" aria-hidden="true"></i>;
              else if(field==='x') toShow = <i className="fa fa-times" aria-hidden="true"></i>;
              else if(field==='') toShow = field
              let fieldClasses = classNames({
                field:true,
                cross:this.props.clickable && ((this.props.mode==='multiplayer' && this.props.currentSign === 'x') || (this.props.onlineSign==='x' && this.props.mode==='classic')) && this.state.board[index]==='',
                circle:this.props.clickable && ((this.props.mode==='multiplayer' && this.props.currentSign === 'o') || (this.props.onlineSign==='o' && this.props.mode==='classic')) && this.state.board[index]==='',
                win:this.state.winFields.indexOf(index) !== -1,
              })
              return <div key={index}  onClick={() => { this.props.mode==='classic' ? this.handleOnlineModeClick(index,this.props.index) : this.handleSquareClick(index)}} className={fieldClasses}>{toShow}</div>
            })}
            <div className={classes}><span>{info}</span></div>
          </div>
    )
  }
}
export default SmBoard;
