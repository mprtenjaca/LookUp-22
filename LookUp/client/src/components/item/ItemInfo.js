import React, { useEffect, useState } from "react";
import { Button, Carousel, CarouselItem, Col, Modal, Row } from "react-bootstrap";
import moment from "moment";

import "../../assets/css/item-detail.css";
import { useHistory, useLocation, useParams } from "react-router";
import { deleteConversation, MESS_TYPES } from "../../redux/actions/messageAction";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "../../redux/socket";
import { categories } from "../../utils/categoriesConstants";
import { Link } from "react-router-dom";
import { deleteListing, deleteSavedListing, updateListingStatus, saveListing, unSaveListing } from "../../redux/actions/listingAction";
import { deleteAllNotifiesForListing } from "../../redux/actions/notifyAction";

const ItemInfo = ({ item, user }) => {
  const { auth, alert, detailItem } = useSelector((state) => state);
  const { id } = useParams();

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [sold, setSold] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveSafeLoad, setSaveSafeLoad] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
      const isSoldListing = item.some(listing => listing.isSold === true)
      setSold(isSoldListing)
      
  }, [item, detailItem]);

  useEffect(() => {
    if (auth.user.saved.find((savedListingID) => savedListingID === id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [auth.user.saved]);

  const handleChat = (itemUser, itemDetail) => (e) => {
    dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...itemUser, text: "", listing: itemDetail } });
    return history.push("/message/" + itemUser._id + "?itemId=" + itemDetail._id);
  };

  const handleSaveUnsaveListing = (itemDetail) => (e) => {
    if (saveSafeLoad) return;

    setSaveSafeLoad(true);
    if (!saved) {
      dispatch(saveListing({ listing: itemDetail, auth }));
    } else {
      dispatch(unSaveListing({ listing: itemDetail, auth }));
    }
    setSaveSafeLoad(false);
  };

  const handleSellListing = (itemDetail) => (e) => {
    dispatch(updateListingStatus({listing: itemDetail, auth}))
    // !alert.loading && window.location.reload()

  }

  const handleEditListing = (itemDetail) => (e) => {
    history.push("/item/edit/" + itemDetail._id);
  };

  const handleDeleteListing = (itemDetail) => (e) => {
    dispatch(deleteListing({listing: itemDetail, auth, socket}))
    dispatch(deleteConversation({auth, id: auth.user._id, itemID: itemDetail._id}))
    dispatch(deleteAllNotifiesForListing({auth, listingID: id}))
    dispatch(deleteSavedListing({listing: itemDetail, auth}))
    handleClose()
    history.push('/profile/' + auth.user._id)
  };

  return (
    <div className="item-container">
      {item.map((itemDetail) => (
        <div className="item" key={itemDetail._id}>
          <div className="test">
            <div>
              <Row className="item-path">
                <Col md={12}>
                  <span>
                    {categories.filter((category) => category.path === itemDetail.category).map((category) => category.heading)} / {itemDetail.subCategory} / {itemDetail.city} / {itemDetail.name}
                  </span>
                </Col>
              </Row>

              <Row className="user-header">
                {/* <UserCard user={itemDetail.user}/> */}
                <Col md={7} sm={9} xs={9} className="user-image">
                  <Link to={`/profile/${itemDetail.user._id}`} className="item-info-user">
                    <img src={itemDetail.user.avatar} />
                    <h5>
                      {itemDetail.user.firstName} {itemDetail.user.lastName}
                    </h5>
                  </Link>
                </Col>

                {auth.user._id !== itemDetail.user._id ? (
                  <>
                    <Col md={2} sm={3} xs={3} className="save-post-col">
                      <button className={`save-post-btn ${saved ? "saved-btn" : "unsaved-btn"}`} onClick={handleSaveUnsaveListing(itemDetail)}>
                        <span className={`material-icons ${saved ? "saved-icon" : "unsaved-icon"}`}>favorite</span>
                      </button>
                    </Col>

                    <Col md={3} sm={12} xs={12} className="chat-btn-item">
                      <button onClick={handleChat(itemDetail.user, itemDetail)}>Chat to buy</button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col md={5} sm={3} xs={3} className="edit-item-btn item-info-section">
                      <ul className="navbar-nav flex-row disable-select">
                        <li className="nav-item dropdown">
                          <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <span className="material-icons-outlined nav-item dropdown item-dropdown-options">more_vert</span>
                          </span>

                          <div className="dropdown-menu item-dropdown-menu" aria-labelledby="navbarDropdown">
                            <div className="dropdown-menu-item" onClick={handleEditListing(itemDetail)}>
                              <span className="material-icons-outlined nav-item dropdown">edit</span>Edit
                            </div>
                            <div className="dropdown-menu-item" onClick={handleSellListing(itemDetail)}>
                              <span className="material-icons-outlined nav-item dropdown">sell</span>Mark {sold ? "unsold" : "sold"}
                            </div>
                            <div className="dropdown-menu-item" onClick={handleShow}>
                              <span className="material-icons-outlined nav-item dropdown">delete</span>Delete
                            </div>
                          </div>
                        </li>
                      </ul>
                    </Col>
                  </>
                )}
              </Row>

              <Row>
                <Col md={12} className="item-image">
                  <Carousel interval={null}>
                    {itemDetail.photos.map((photo, index) => (
                      <CarouselItem key={index} className="item-info-carousel">
                        {
                          itemDetail.isSold ? <span>This item is sold</span> : <></>
                        }
                        <img src={photo.url} className={`${itemDetail.isSold ? 'listing-sold-img' : ''}`}/>
                      </CarouselItem>
                    ))}
                  </Carousel>
                </Col>
              </Row>

              <Row className="item-info">
                <Col md={12}>
                  <span className="item-price">
                    {itemDetail.price} {itemDetail.currency}
                  </span>
                </Col>
                <Col md={12}>
                  <h1>{itemDetail.name}</h1>
                </Col>
                <Col md={12}>
                  <span>{itemDetail.condition}</span>
                </Col>

                <Col md={12} className="category">
                  <ul className="category-list">
                    <li>
                      <span onClick={() => history.push("/category/" + itemDetail.category)}>
                        {categories.filter((category) => category.path === itemDetail.category).map((category) => category.heading)}
                      </span>
                    </li>
                    <li>
                      <span className="subcategoty">{itemDetail.subCategory}</span>
                    </li>
                  </ul>
                </Col>
              </Row>

              <Row>
                <Col md={12} className="created-at">
                  {moment(itemDetail.createdAt).format("DD-MMM-YYYY")}
                </Col>
              </Row>

              <Row>
                <Col md={12} className="location">
                  <span className="material-icons-outlined">place</span>
                  <p>
                    {itemDetail.city} {itemDetail.postalCode}
                  </p>
                </Col>
              </Row>
            </div>
          </div>

          <Modal show={show} onHide={handleClose} className="confirmation-delete-dialog">
            <Modal.Header closeButton>
              <Modal.Title>Delete Listing</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
            <Modal.Footer>
              <button className="close-btn" onClick={handleClose}>
                Close
              </button>
              <button className="delete-btn" onClick={handleDeleteListing(itemDetail)}>
                Delete
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      ))}
    </div>
  );
};

export default ItemInfo;
