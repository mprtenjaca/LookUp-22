import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";

const ItemDetailSection = () => {
  const { id } = useParams();
  const history = useHistory();

  const { auth, messageRed } = useSelector((state) => state);
  const [itemDetail, setItemDetail] = useState({});

  useEffect(() => {
    const url = new URLSearchParams(history.location.search);
    const urlItemId = url.get("itemId");

    const newData = messageRed.data.find((item) => item.listing && item.listing._id === urlItemId);
    if (newData) {
      setItemDetail(newData.listing);
    }
  }, [messageRed.data.listing, messageRed.data, itemDetail, id, history.location.search]);

  return (
    <div className={`item-section ${itemDetail.isSold ? 'sold-item-section' : ''}`}>
      {console.log(itemDetail)}
      <Link to={`/item/${itemDetail._id}`}>
        <div className="item-section-image">
          {
            itemDetail.isSold ? <span className="item-sold">This item is sold</span> : <></>
          }
          <img src={itemDetail.photos && itemDetail.photos[0].url} className={`${itemDetail.isSold ? 'listing-sold-img' : ''}`}/>
        </div>
        <div className="item-section-info">
          <h4>{itemDetail.name}</h4>
          <p>
            {itemDetail.price} {itemDetail.currency}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ItemDetailSection;
