import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserCard = ({ user, showMsg }) => {
  return (
    <>
      <div className="message_user user-card">
        <div className="d-flex p-2 align-items-center justify-content-between w-100 undefined">
          <div>
            <Link to={`/profile/${user._id}`} className="d-flex align-items-center">
              <a className="d-flex align-items-center" href={`/profile/${user._id}`}>
                <img src={user.avatar} alt="avatar" className="big-avatar" />
                <div className="ml-1">
                  <span className="d-block user-name">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
