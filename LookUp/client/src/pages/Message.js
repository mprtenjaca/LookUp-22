import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Conversations from "../components/message/Conversations";

const Message = () => {
  const dispatch = useDispatch();
  const { auth, alert, messageRed } = useSelector((state) => state);

  const [conversations, setConversations] = useState([])

  useEffect(() => {
    if(messageRed.users){
        setConversations(messageRed.users)
    }
  }, [messageRed.users])

  return (
    <div className="message-main">
      <Row className="main">
        <Col md={3} className="conversations">
          <Conversations />
        </Col>

        <Col md={9} className="chat hide-chat">
          Message
        </Col>
      </Row>
    </div>
  );
};

export default Message;
