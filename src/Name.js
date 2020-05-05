import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './name.css'

export default function Name ({ onUserSetName }) {
  const [name, setName] = useState('')

  function handleNameChange (event) {
    setName(event.target.value.trim())
  }

  function handleEnterClick () {
    if (name) {
      onUserSetName(name)
    }
  }

  return ReactDOM.createPortal(
    <div className="mask">
      <div className="name">
        <h2>请输入昵称</h2>
        <input value={name} onChange={handleNameChange} />
        <p onClick={handleEnterClick}>→</p>
      </div>
    </div>,
    document.getElementById('root')
  )
}