import React, { useEffect, useState } from 'react'
import './Notification.css'

export default function Notification ({ text }) {
  const [style, setStyle] = useState({
    right: '-12rem'
  })

  useEffect(() => {
    setStyle({
      right: '1rem'
    })
    const timer = setTimeout(() => {
      setStyle({
        right: '-12rem'
      })
      clearTimeout(timer)
    }, 1000)
  }, [])

  return (
    <div className="notice" style={style}>
      <p>
        {
          text.map((v, i) => <span key={i} style={{ color: v.color }}>{v.text}</span>)
        }
      </p>
    </div>
  )
}