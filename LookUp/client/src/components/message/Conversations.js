import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getConversations } from '../../redux/actions/messageAction';
import UserCard from '../user/UserCard'

const Conversations = () => {
  const dispatch = useDispatch();
  const { auth, alert, messageRed } = useSelector((state) => state);

  useEffect(() => {
    if(messageRed.firstLoad){
      return;
    }
    dispatch(getConversations({auth}))
  },[dispatch, auth, messageRed.firstLoad])

  return (
    <div className="conversations-list">
      {
        messageRed.users.map(user => (
          <div key={user._id}>
            <UserCard user={user} showMsg={true}/>
          </div>
        ))
      }
    </div>
  )
}

export default Conversations
