import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client'
import * as uuid from 'uuid'
import './App.css';
import Name from './Name'
import Notification from './Notification'
import CurrentEditingUsers from './CurrentEditingUsers'

const classNames = ['type1', 'type2']

function App() {
  const [btnStyle, setBtnStyle] = useState('0')
  const [btnText, setBtnText] = useState('按钮文字')
  const ctx = useRef({
    socket: null,
    prevEditingUsers: []
  })
  const [nameVisibility, setNameVisibility] = useState(true)
  const [currentEditingUsers, setCurrentEditingUsers] = useState([])

  useEffect(() => {
    ctx.current.socket = io('http://localhost:3000')
    ctx.current.socket.on('save', data => {
      const { btnStyle, btnText } = data
      setBtnStyle(btnStyle)
      setBtnText(btnText)
    })
    ctx.current.socket.on('user_join', data => {
      const { users } = data
      setCurrentEditingUsers(prevEditingUsers => {
        ctx.current.prevEditingUsers = prevEditingUsers
        return users
      })
    })
    ctx.current.socket.on('user_quit', data => {
      const { users } = data
      setCurrentEditingUsers(prevEditingUsers => {
        ctx.current.prevEditingUsers = prevEditingUsers
        return users
      })
    })
  }, [])

  useEffect(() => {
    const newJoinedUsers = currentEditingUsers.filter(v => !ctx.current.prevEditingUsers.find(k => k.id === v.id))
    const newQuitUsers = ctx.current.prevEditingUsers.filter(v => !currentEditingUsers.find(k => v.id === k.id))
    newQuitUsers.map(v => (
      <Notification
        key={uuid.v4()}
        text={[{ 
          text: v.name,
          color: 'darksalmon'
        }, {
          text: ' 退出了 编辑',
          color: 'white'
        }]}
      />
    ))
    newJoinedUsers.map(v => (
      <Notification
        key={uuid.v4()}
        text={[{ 
          text: v.name,
          color: 'darksalmon'
        }, {
          text: ' 参与了 编辑',
          color: 'white'
        }]}
      />
    ))
  }, [currentEditingUsers])

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

  function handleUserSetName (name) {
    ctx.current.socket.emit('user_join', {
      id: ctx.current.socket.id,
      name
    })
    setNameVisibility(false)
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
      {nameVisibility && <Name onUserSetName={handleUserSetName} />}
      <CurrentEditingUsers users={currentEditingUsers} />
    </div>
  );
}

export default App;
