import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Conversations from "../../components/message/Conversations";
import ItemDetailSection from "../../components/message/ItemDetailSection";
import MessagesSection from "../../components/message/MessagesSection";
import { GLOBALTYPES } from "../../redux/types/globalTypes";

const Conversation = () => {

  return (
    <div className="d-flex custom-conversation">
      <div className="col-lg-3 col-md-4 border-right px-0 left_mess hide-conversations">
        <Conversations/>
      </div>

      <div className="col-lg-7 col-md-8 px-0 chat-section">
        <MessagesSection/>
      </div>

      <div className="col-lg-2 col-md-0 px-0 item-detail-section">
        <ItemDetailSection/>
      </div>
    </div>
  );
};

export default Conversation;
