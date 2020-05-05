import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './notification.css'

export default function Notification ({ text }) {
  const [style, setStyle] = useState({
    right: '-10rem'
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setStyle({
        right: '-10rem'
      })
      clearTimeout(timer)
    }, 1000)
  }, [])

  return ReactDOM.createPortal(
    <div className="notice" style={style}>
      <p>
        {
          text.map((v, i) => <span key={i} style={{ color: v.color }}>{v.text}</span>)
        }
      </p>
    </div>,
    document.getElementById('root')
  )
}