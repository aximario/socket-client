import React from 'react'
import ReactDOM from 'react-dom'
import * as uuid from 'uuid'
import Notification from './Notification'

let queue = []

export default function message (text) {
  queue = queue.concat({ id: uuid.v4(), text })
  const timer = setTimeout(() => {
    clearTimeout(timer)
    queue = queue.slice(1)
  }, 2000)
  ReactDOM.render(
    <>
      {queue.map(v => (
        <Notification
          key={v.id}
          text={v.text}
        />
      ))}
    </>,
    document.getElementById('notification')
  )
}