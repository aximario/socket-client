import React from 'react'
import './CurrentEditingUsers.css'

export default function CurrentEditingUsers ({ users }) {
  return (
    <div className="users">
      {users.map(v => (
        <div
          key={v.id}
          className="user"
        >
          <div>{v.name.slice(0, 1)}</div>
          <p>{v.name}</p>
        </div>
      ))}
    </div>
  )
}