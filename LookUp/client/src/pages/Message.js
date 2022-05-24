import React from 'react'
import { Col, Row } from "react-bootstrap";

import Conversations from '../components/message/Conversations'

const Message = () => {
  return (
    <div className='message-main'>
            <Row className='main'>
                <Col md={3} className="conversations">
                    <Conversations/>
                </Col>

                <Col md={9} className="chat">
                    Message
                </Col>
            </Row>

            {/* <Row>
                <Col md={12}>
                    Message
                </Col>
            </Row> */}
    </div>
  )
}

export default Message