import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { isReadNotify } from "../../redux/actions/notifyAction";

const ItemCard = ({ user, item, showMsg }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, notify } = useSelector((state) => state);

  const [isNewMessageNotification, setIsMessageNotification] = useState(true);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [notificationData, setNotificationData] = useState({});

  useEffect(() => {
    const notification = notify.data.find((noti) => noti.type === "message" && noti.listing === item._id);
    if (notification) {
      setIsMessageNotification(notification.isRead);
      setNotificationData(notification);
    }
  }, [notify, auth, isNewMessageNotification, isConversationActive, notificationData]);

  const handleIsReadAndConversationActive = () => {
    if (Object.keys(notificationData).length != 0) {
      dispatch(isReadNotify({ msg: notificationData, auth }));
    }

    setIsConversationActive(true);
  };

  const isActive = () => {
    const url = new URLSearchParams(history.location.search);
    const urlItemId = url.get("itemId");

    if (item._id === urlItemId) {
      return "active-conversation";
    } else {
      return "";
    }
  };

  return (
    <>
      <div className={`message_user user-card ${isActive()} `}>
        <div className="p-2 align-items-center justify-content-between w-100 undefined">
          <div className="user-card-wrapper">
            <Link to={showMsg ? `/message/${user._id}?itemId=${item._id}` : `/item/${item._id}`} onClick={handleIsReadAndConversationActive} className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                <img src={item.photos[0].url} alt="avatar" className="big-avatar" />
                <div className="ml-1">
                  <span className="d-block user-name">{item.name}</span>
                  {showMsg ? <small style={{ opacity: 0.7, color: "gray" }}>{user.text}</small> : <></>}
                </div>
              </div>
              {!isNewMessageNotification && showMsg ? <div className="active-bullet"></div> : <></>}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemCard;
