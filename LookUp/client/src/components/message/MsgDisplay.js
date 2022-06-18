import React from "react";

const MsgDisplay = ({ user, msg }) => {
  return (
    <>
      {msg.text && (
        <div className="chat_text">
          {msg.text}

          <div className="chat_time">{new Date(msg.createdAt).toLocaleTimeString()}</div>
        </div>
      )}
    </>
  );
};

export default MsgDisplay;
