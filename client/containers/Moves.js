import React from 'react'
import classNames from 'classnames'

const Moves = ({currentNr,currentSign}) => {
    const numbers = [];
    for(let i = 1; i<=81; i++){
        numbers.push(i);
    }
    console.log('nr', currentNr)
    return(
        <div className="moves">
            {
                numbers.map((number,index) => {
                    let classes = classNames({
                        number:true,
                        done:index<currentNr ? true : false,
                        cross:number===currentNr+1 && currentSign==='x',
                        circle:number===currentNr+1 && currentSign==='o',
                    })
                    return <div key={number} className={classes}>{number}</div>
                })
            }
        </div>
    )
}

export default Moves;