import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client'
import './App.css';

import Form from 'antd/es/form'
import 'antd/es/form/style/css'
import Input from 'antd/es/input'
import 'antd/es/input/style/css'
import Radio from 'antd/es/radio'
import 'antd/es/radio/style/css'
import Button from 'antd/es/button'
import 'antd/es/button/style/css'
import Row from 'antd/es/row'
import 'antd/es/row/style/css'
import Col from 'antd/es/col'
import 'antd/es/col/style/css'
import Drawer from 'antd/es/drawer'
import 'antd/es/drawer/style/css'
import Avatar from 'antd/es/avatar'
import 'antd/es/avatar/style/css'
import Tabs from 'antd/es/tabs'
import 'antd/es/tabs/style/css'

import Name from './Name'
import message from './message'

const btnClassNames = ['type1', 'type2']
const backgroundClassNames = ['background1', 'background2']

function App() {
  const [theme, setTheme] = useState('0')
  const [btnStyle, setBtnStyle] = useState('0')
  const [btnText, setBtnText] = useState('按钮文字')
  const ctx = useRef({
    socket: null,
    prevEditingUsers: [],
    user: null
  })
  const [nameVisibility, setNameVisibility] = useState(true)
  const [currentEditingUsers, setCurrentEditingUsers] = useState([])
  const [currentEditingUsersPanelVisibility, setCurrentEditingUsersPanelVisibility] = useState(false)
  const [editPanelVisibility, setEditPanelVisibility] = useState(false)

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  }

  useEffect(() => {
    ctx.current.socket = io('http://localhost:3000')
    ctx.current.socket.on('save', data => {
      const { btnStyle, btnText, theme, user } = data
      setBtnStyle(btnStyle)
      setBtnText(btnText)
      setTheme(theme)
      message([{
        text: user.name,
        color: 'black'
      }, {
        text: ' 更新了页面',
        color: 'black'
      }])
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
    newQuitUsers.map(v => message([{
      text: v.name,
      color: 'black'
    }, {
      text: ' 退出了编辑',
      color: 'black'
    }]))
    newJoinedUsers.map(v =>message([{
      text: v.name,
      color: 'black'
    }, {
      text: ' 加入了编辑',
      color: 'black'
    }]))
  }, [currentEditingUsers])

  function handleThemeChange (event) {
    setTheme(event.target.value)
  }

  function handleBtnTextChange (event) {
    setBtnText(event.target.value.trim())
  }

  function handleBtnStyleChange (event) {
    setBtnStyle(event.target.value)
  }

  function handleSave () {
    ctx.current.socket.emit('save', {
      btnStyle,
      btnText,
      theme,
      user: ctx.current.user
    })
  }

  function handleUserSetName (name) {
    ctx.current.user = {
      id: ctx.current.socket.id,
      name
    }
    ctx.current.socket.emit('user_join', ctx.current.user)
    setNameVisibility(false)
  }

  function handleCurrentEditingUsersPanelSwitchClick () {
    setCurrentEditingUsersPanelVisibility(!currentEditingUsersPanelVisibility)
  }

  function handleCurrentEditingUsersPanelClose () {
    setCurrentEditingUsersPanelVisibility(false)
  }

  function handleEditPanelSwitchClick () {
    setEditPanelVisibility(!editPanelVisibility)
  }
  
  function handleEditPanelClose () {
    setEditPanelVisibility(false)
  }

  return (
    <div className={`panel ${backgroundClassNames[theme]}`}>
      <Button
        type="primary"
        shape="round"
        className="current-users-switch"
        onClick={handleCurrentEditingUsersPanelSwitchClick}
      >
        在线{currentEditingUsers.length}人
      </Button>
      <Button
        type="primary"
        shape="round"
        className="edit-panel-switch"
        onClick={handleEditPanelSwitchClick}
      >
        编辑
      </Button>
      <div className="preview">
        <div className={btnClassNames[btnStyle]}>{btnText}</div>
      </div>
      <Drawer
        width={88}
        placement="left"
        onClose={handleCurrentEditingUsersPanelClose}
        closable={false}
        visible={currentEditingUsersPanelVisibility}
      >
        {currentEditingUsers.map(v => (
          <Row key={v.id}>
            <Col>
              <Avatar size="large">{v.name}</Avatar>
            </Col>
          </Row>
        ))}
      </Drawer>
      <Drawer
        height={300}
        placement="bottom"
        onClose={handleEditPanelClose}
        closable={false}
        visible={editPanelVisibility}
        className="config-drawer"
      >
        <Tabs>
          <Tabs.TabPane tab="主题设置" key="1">
            <Row>
              <Col xs={24}>
                <Form.Item
                  label="主题"
                  {...formItemLayout}
                >
                  <Radio.Group onChange={handleThemeChange} value={theme}>
                    <Radio value="0">经典</Radio>
                    <Radio value="1">暗色</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="按钮设置" key="2">
            <Row>
              <Col xs={24}>
                <Form.Item
                  label="按钮文字"
                  {...formItemLayout}
                >
                  <Input value={btnText} onChange={handleBtnTextChange} />
                </Form.Item>
                <Form.Item
                  label="按钮样式"
                  {...formItemLayout}
                >
                  <Radio.Group onChange={handleBtnStyleChange} value={btnStyle}>
                    <Radio value="0">样式一</Radio>
                    <Radio value="1">样式二</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
        <Button
          type="primary"
          onClick={handleSave}
          className="save-button"
        >保存</Button>
      </Drawer>
      {nameVisibility && <Name onUserSetName={handleUserSetName} />}
    </div>
  );
}

export default App;
