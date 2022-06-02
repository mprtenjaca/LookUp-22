import React from "react";
import { Col, Row } from "react-bootstrap";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import qs from "qs";

const ItemCard = ({ user, item }) => {
  const history = useHistory();
  const goToChat = () => {
    const filterParams = history.location.pathname.substring(1);
    const filtersFromParams = qs.parse(filterParams);
  };

  return (
    <>
      <div className="message_user user-card">
        <div className="d-flex p-2 align-items-center justify-content-between w-100 undefined">
          <div>
            <Link to={`/message/${user._id}?itemId=${item._id}`} className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                <img src={item.photos[0].url} alt="avatar" className="big-avatar" />
                <div className="ml-1">
                  <span className="d-block user-name">{item.name}</span>
                  {
                    user.text ? <small style={{ opacity: 0.7, color: 'gray' }}>{user.text}</small> : <></>
                  }
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemCard;
