import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Dropdown, DropdownButton, Row, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";

import "../../assets/css/profile-card.css";
import { logout } from "../../redux/actions/authAction";
import { LISTING_TYPES } from "../../redux/actions/listingAction";
import { getProfileUser, PROFILE_TYPES } from "../../redux/actions/profileAction";
import { getDataAPI } from "../../utils/fetchData";
import LoadMoreBtn from "../LoadMoreBtn";
import EditProfile from "./EditProfile";
import SavedListings from "./SavedListings";
import SoldListings from "./SoldListings";

const ProfileInfo = ({ id, auth, profile, listingRed, alert, dispatch }) => {
  const [userData, setUserData] = useState([]);
  const [listings, setListings] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [load, setLoad] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const pageEnd = useRef();
  

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
      const sellingListings = listingRed.listings.filter(listing => listing.isSold === false)
      setListings(sellingListings);
      setResult(listingRed.result);
      setPage(listingRed.page);
    } else {
      const newData = profile.users.filter((user) => user._id === id);
      setUserData(newData);

      profile.listings.forEach((data) => {
        if (data._id === id) {
          const sellingListings = data.listings.filter(listing => listing.isSold === false)
    
          setListings(sellingListings);
          setResult(data.result);
          setPage(data.page);
        }
      });

    }

    
  }, [id, auth.user, dispatch, profile.users, profile.listings, listingRed.listings]);

  const handleListingDetails = (listingId) => (e) => {
    const link = "/item/" + listingId;
    history.push(link);
  };

  const handleLoadMore = async () => {
    setLoad(true)
    const res = await getDataAPI(`user_listings/${id}?limit=${page * 9}`, auth.token)
    const newData = {...res.data, page: page + 1, _id: id}
    if(auth.user._id === id){
      dispatch({type: LISTING_TYPES.UPDATE_LISTINGS, payload: newData})
    }else{
      dispatch({type: PROFILE_TYPES.UPDATE_LISTING, payload: newData})
    }
    setLoad(false)
  }

  return (
    <div className="card-container">
      <div className="profile-container">
        {userData.map((user, index) => (
          <Container fluid key={index}>
            <Row className="profile" key={user._id}>
              <Col lg={6} md={6} sm={12}>
                <div className="profile-data">
                  <div className="profile-image">
                    <img src={user.avatar} />
                  </div>
                  <div className="profile-data-info">
                    <p className="profile-user-name">
                      {user.firstName} {user.lastName}
                    </p>
                    <span>
                      <small className="profile-mini-info">
                        <span className="material-icons">place</span>
                        {user.city}, {user.postalCode}
                      </small>
                      <small className="profile-mini-info">
                        <span className="material-icons">call</span>
                        {user.contactPhone}
                      </small>
                    </span>
                  </div>
                </div>
              </Col>
              <Col lg={6} md={6} sm={12} className="profile-about">
                <div className="profile-user-settings">
                  {id === auth.user._id ? (
                    <button className="edit-profile-btn" onClick={() => setOnEdit(true)}>
                      Edit profile
                    </button>
                  ) : (
                    <></>
                  )}
                  <span className="material-icons logout-btn" onClick={() => dispatch(logout())}>
                    logout
                  </span>
                </div>
              </Col>
            </Row>

            {onEdit && <EditProfile setOnEdit={setOnEdit} />}
          </Container>
        ))}
      </div>

      <div className="card-body">

        <Tabs defaultActiveKey="selling" id="uncontrolled-tab-example" className="profile-tabs">
          <Tab eventKey="selling" title="Selling">
            <Row>
              {listings.map((listing) => (
                <Col className="card-column" lg={3} md={4} sm={6} xs={6} key={listing._id} onClick={handleListingDetails(listing._id)}>
                  <Card>
                    <Card.Img variant="top" src={listing.photos[0].url} />
                    <Card.Body>
                      <Card.Title>
                        {listing.price} {listing.currency}
                      </Card.Title>
                      <Card.Text>
                        <span className="card-text">{listing.name}</span>
                      </Card.Text>
                      <Card.Text>
                        <p className="card-description">{listing.description}</p>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              <LoadMoreBtn result={result} page={page} load={load} handleLoadMore={handleLoadMore}/>
            </Row>
          </Tab>

          {auth.user._id === id ? (
            <Tab eventKey="sold" title="Sold">
              <SoldListings auth={auth} profile={profile} listings={listingRed} id={id} dispatch={dispatch} />
            </Tab>
          ) : (
            <></>
          )}
          {auth.user._id === id ? (
            <Tab eventKey="saved" title="Saved">
              <SavedListings auth={auth} dispatch={dispatch} />
            </Tab>
          ) : (
            <></>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileInfo;
