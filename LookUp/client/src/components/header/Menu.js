import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { GLOBALTYPES } from "../../redux/types/globalTypes";
import { getNotifies, isReadNotify } from "../../redux/actions/notifyAction";
import NotificationDropdown from "./NotificationDropdown";
// import Avatar from '../Avatar'
// import NotifyModal from '../NotifyModal'

const Menu = () => {
  const { auth, notify } = useSelector((state) => state);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const navLinks = [
    { label: "Home", icon: "home", path: "/" },
    // { label: "List a product", icon: "control_point", path: "/new-listing" },
    // { label: "Inbox", icon: "email", path: "/message" },
    // { label: "Profile", icon: "account_circle", path: `/profile/${auth.user._id}` },
  ];

  const isActive = (pn) => {
    if (pn === pathname) {
      return "active";
    } else {
      return "";
    }
  }

  const handleIsNotificationRead = () => {
    if(notify.data.filter((item) => item.type === "new-listing" && item.isRead === false).length > 0){
      notify.data.forEach(notification => {
        if(notification.type === 'new-listing' && notification.isRead === false){
          dispatch(isReadNotify({ msg: notification, auth }))
        }
      })
    }
  }

  return (
    <div className="menu">
      <ul className="navbar-nav flex-row disable-select">
        {navLinks.map((link, index) => (
          <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
            <Link className="nav-link" to={link.path}>
              <span className="material-icons-outlined">{link.icon}</span>
            </Link>
          </li>
        ))}
        <li className={`nav-item px-2 ${isActive("/message")}`}>
          <Link className="nav-link" to={"/message"}>
            <span className="material-icons-outlined">inbox</span>
            {notify.data.filter((item) => item.type === "message" && item.isRead === false).length !== 0 ? (
              <span className="notifications-count">{notify.data.filter((item) => item.type === "message" && item.isRead === false).length}</span>
            ) : (
              <></>
            )}
          </Link>
        </li>

        <li className={`nav-item px-2 listing-button ${isActive("/new-listing")}`}>
          <Link className="nav-link" to={"/new-listing"}>
            <span className="material-icons-outlined">control_point</span>
          </Link>
        </li>
        <li className="nav-item dropdown notification-nav-item"  style={{ opacity: 1 }} onMouseDown={handleIsNotificationRead}>
          <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            <span className="material-icons-outlined">notifications</span>
            <span className="notifications-count">{notify.data.filter((item) => item.type === "new-listing" && item.isRead === false).length}</span>
          </span>

          <div className="dropdown-menu notification-dropdown-menu" aria-labelledby="navbarDropdown">
            <NotificationDropdown />
          </div>
        </li>

        <li className={`nav-item px-2 ${isActive(`/profile/${auth.user._id}`)}`}>
          <Link className="nav-link" to={`/profile/${auth.user._id}`}>
            <span className="material-icons-outlined">account_circle</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
