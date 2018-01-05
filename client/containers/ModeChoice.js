import React from 'react'
import {Link} from 'react-router-dom'
import UsernamePick from './UsernamePick.jsx'
const ModeChoice  = ({setMode,setUsername,mode}) => {
    return(
        <div className="modeChoice">
            <h2>Choose game mode</h2>
            <button onClick={()=>setMode('classic')} className={mode==='classic' ? 'active' : ''} >online</button>
            <button onClick={()=>setMode('multiplayer')} className={mode==='multiplayer' ? 'active' : ''} >multiplayer</button>
            <UsernamePick mode={mode} setUsername={setUsername}/>
        </div>
    )
}

export default ModeChoice;