import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import io from 'socket.io-client'

const classNames = ['type1', 'type2']

function App() {
  const [btnStyle, setBtnStyle] = useState('0')
  const [btnText, setBtnText] = useState('按钮文字')
  const ctx = useRef({
    socket: null
  })

  useEffect(() => {
    ctx.current.socket = io('http://localhost:3000')
    ctx.current.socket.on('save', data => {
      console.log(data)
      const { btnStyle, btnText } = data
      setBtnStyle(btnStyle)
      setBtnText(btnText)
    })
  }, [])

  function handleBtnTextChange (event) {
    setBtnText(event.target.value.trim())
  }

  function handleBtnStyleChange (event) {
    setBtnStyle(event.target.value)
  }

  function handleSave () {
    ctx.current.socket.emit('save', {
      btnStyle,
      btnText
    })
  }

  return (
    <div>
      <div className="row">
        <div className={classNames[btnStyle]}>{btnText}</div>
      </div>
      <div className="row">
        <span>文字</span>
        <input value={btnText} onChange={handleBtnTextChange} />
      </div>
      <div className="row">
        <span>样式</span>
        <div>
          <label htmlFor="type1">
            <input type="radio" name="btn-style" id="type1" value="0" checked={btnStyle === '0'} onChange={handleBtnStyleChange} />
            样式一
          </label>
        </div>
        <div>
          <label htmlFor="type2">
            <input type="radio" name="btn-style" id="type2" value="1" checked={btnStyle === '1'} onChange={handleBtnStyleChange} />
            样式二
          </label>
        </div>
      </div>
      <div className="row">
        <div onClick={handleSave}>保存</div>
      </div>
    </div>
  );
}

export default App;
