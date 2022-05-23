import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { GLOBALTYPES } from "../../redux/types/globalTypes";
// import Avatar from '../Avatar'
// import NotifyModal from '../NotifyModal'

const Menu = () => {


  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const navLinks = [
    { label: "Home", icon: "home", path: "/" },
    { label: "List a product", icon: "control_point", path: "/new-listing" },
    { label: "Inbox", icon: "email", path: "/message" },
    { label: "Profile", icon: "account_circle", path: `/profile/${auth.user._id}` },
  ];

  const isActive = (pn) => {
    if (pn === pathname) return "active";
  };

  return (
    <div className="menu">
      <ul className="navbar-nav flex-row">
        {navLinks.map((link, index) => (
          <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
            <Link className="nav-link" to={link.path}>
              <span className="material-icons-outlined">{link.icon}</span>
            </Link>
          </li>
        ))}
        {/* <Link className="nav-link" to={`/profile/${auth.user._id}`}>
          <span className="material-icons-outlined">account_circle</span>  
        </Link> */}


        {/* <li className="nav-item dropdown" style={{ opacity: 1 }}>
          <span
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="material-icons-outlined">account_circle</span>
          </span>

          <div
            className="dropdown-menu"
            aria-labelledby="navbarDropdown"
            style={{ transform: "translateX(-75px)" }}
          >

            <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>
              Profile
            </Link>

            <div className="dropdown-divider"></div>
            <Link
              className="dropdown-item"
              to="/"
              onClick={() => dispatch(logout())}
            >
              Logout
            </Link>
          </div>
        </li> */}
      </ul>
    </div>
  );
};

export default Menu;
