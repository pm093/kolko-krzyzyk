import React from 'react';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      board:['','','','','','','','',''],
      currentSign:'x',
      winner:'',
      sbWon:false,
      unmatched:false,
      counter:0,
    }
    this.winningCases =  [[0,1,2],[3,4,5],[6,7,8],[3,4,5],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.newGame = this.newGame.bind(this);
  }

  checkCombination(winningCases,myBoard){
    for (var i = 0; i < winningCases.length; i++) {
      let testArray=[];
      for (var j = 0; j < winningCases[i].length; j++) {
          testArray.push(myBoard[winningCases[i][j]]);
      }
      if (testArray[0]!=='' && testArray[0]===testArray[1] && testArray[0]===testArray[2]) {
        return true;
      }
    }
    return false
  }
  handleSquareClick(index) {
    if (this.state.board[index]==='') {
      const counter = this.state.counter + 1;
      const board = this.state.board;
      console.log(counter);
      board[index] = this.state.currentSign;
      if (this.checkCombination(this.winningCases,board)){
        this.setState({
          winner:this.state.currentSign,
          sbWon:true
        })
      }
      else if(counter>8) {
        this.setState({
          unmatched:true
        })
      }
      else{
      this.setState((prevState) => ({
        board:board,
        currentSign:prevState.currentSign === 'x' ? 'o' : 'x',
        counter:prevState.counter+1,
      }))
      }
    }
  }
  newGame(){
   this.setState({
     board:['','','','','','','','',''],
     currentSign:'x',
     winner:'',
     sbWon:false,
     unmatched:false,
     counter:0,
   })
  }
  render(){
    if (this.state.sbWon) {
      return(
        <div>
          <span>{this.state.winner}</span> won!
          <button onClick={this.newGame}>try again</button>
        </div>)
    }
    if (this.state.unmatched) {
      return(
        <div>
          Nobody won
          <button onClick={this.newGame}>try again</button>
        </div>)
    }

    return(
      <div className='board'>
        {this.state.board.map((field,index) => {
          return <div key={index} onClick={() => {this.handleSquareClick(index)}} className='square'>{field}</div>
        })}
      </div>
    )
  }
}
export default App;
