import React from "react";
import { Col, Row } from "react-bootstrap";

import Conversations from "../components/message/Conversations";
import ScreenSize from "../components/ScreenSize";

const Message = () => {
  return (
    <div className="message-main">
      <ScreenSize/>
      <Row className="main">
        <Col lg={3} md={5} className="conversations">
          <Conversations />
        </Col>

        <Col lg={9} md={7} className="chat hide-chat">
          <span className="material-icons">question_answer</span>
        </Col>
      </Row>
    </div>
  );
};

export default Message;
