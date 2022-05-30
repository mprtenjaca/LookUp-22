import React from "react";
import { Col, Row } from "react-bootstrap";

import Conversations from "../components/message/Conversations";
import ScreenSize from "../components/ScreenSize";

const Message = () => {
  return (
    <div className="message-main">
      <ScreenSize/>
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
