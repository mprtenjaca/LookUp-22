import React from 'react'

const MsgDisplay = ({user, msg}) => {
  return (
    <>
      {/* <div className='chat_title'>
        <img src={user.avatar}/>
      </div> */}

      {msg.text && <div className='chat_text'>{msg.text}
      
      <div className='chat_time'>
        {new Date(msg.createdAt).toLocaleTimeString()}
      </div>
      </div>}

      {/* <div className='chat_time'>
        {new Date(msg.createdAt).toLocaleTimeString()}
      </div> */}
    </>
  )
}

export default MsgDisplay