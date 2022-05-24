import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  return (
    <>
      <div className="message_user ">
        <div className="d-flex p-2 align-items-center justify-content-between w-100 undefined">
          <div>
            <Link  className="d-flex align-items-center">
              <a className="d-flex align-items-center" href="/profile/60ba800f44039900150d4b78">
                <img src="https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png" alt="avatar" className="big-avatar" />
                <div className="ml-1">
                  <span className="d-block">Marko Prtenjaca</span>
                  <small>
                    <div>hi tako ili ovako asd as dasdd </div>
                  </small>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
      {/* <Row classNameName='d-flex user-card'>
            <Col classNameName="mx-auto">
                <img classNameName='avatar' src='https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'/>
            </Col>
            <Col classNameName="ml-1 user-card-info">
                <p>Marko Prtenjaca</p>
                <small>nudim vam to i to</small>
            </Col>
        </Row> */}
    </>
  );
};

export default UserCard;
