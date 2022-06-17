import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import moment from "moment";
import { Link } from "react-router-dom";

import noNewNotifications from "../../assets/images/noNewNotifications.png";
import { useDispatch, useSelector } from "react-redux";
import { isReadNotify } from "../../redux/actions/notifyAction";

const NotificationDropdown = () => {
  const { auth, notify } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState([]) 

  useEffect(() => {
    const filteredNotifications = notify.data.filter((item) => item.type === "new-listing");
    if (filteredNotifications) {
      setNotifications(filteredNotifications);
    }
  }, [auth, notify]);

  const isRead = (notification) => {
    if (notification.isRead === false) {
      return "active-notification";
    }

    return "";
  };

  const handleIsNotificationRead = () => {
    if(notifications){
      
      notifications.forEach(notification => dispatch(isReadNotify({ msg: notification, auth })))

    }
  };

  return (
    <div className="notification-container">
      {notifications.length !== 0 ? (
        notifications.map((notification, index) => {
          if (notification.type === "new-listing") {
            return (
                <Row className="notification-row" key={index} >
                  <Link to={notification.url}>
                    <Col className={`notification-info ${isRead(notification)}`}>
                      <div><img src={notification.image} /></div>
                      <span>{notification.text}</span>
                      <small>{moment(notification.createdAt).fromNow()}</small>
                    </Col>
                  </Link>
                </Row>
            );
          }
        })
      ) : (
        <div className="no-notifications">
          <img src={noNewNotifications} /> <br />
          <span>No new notifications</span>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
