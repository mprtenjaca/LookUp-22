import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Conversations from "../../components/message/Conversations";
import MessagesSection from "../../components/message/MessagesSection";

const Conversation = () => {
  return (
    <div className="d-flex custom-conversation">
      <div className="col-md-4 border-right px-0 left_mess hide-conversations">
        <Conversations/>
      </div>

      <div className="col-md-8 px-0">
        <MessagesSection/>
      </div>
    </div>
  );
};

export default Conversation;
