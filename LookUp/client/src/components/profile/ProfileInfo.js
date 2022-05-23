import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import "../../assets/css/profile-card.css";
import { getProfileUser } from "../../redux/actions/profileAction";
import EditProfile from "./EditProfile";


const ProfileInfo = ({id, auth, profile, dispatch}) => {
  
  const [userData, setUserData] = useState([]);
  const [listings, setListings] = useState([]);
  const [result, setResult] = useState(9)
  const [page, setPage] = useState(0)
  const [load, setLoad] = useState(false)
  const [onEdit, setOnEdit] = useState(false)

  const history = useHistory()

  useEffect(() => {

    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const newData = profile.users.filter(user => user._id === id)
      setUserData(newData);
    }


    profile.listings.forEach(data => {
      if(data._id === id){
          setListings(data.listings)
          setResult(data.result)
          setPage(data.page)
      }
    })

  }, [id, auth.user, dispatch, profile.users, profile.listings]);

  const handleListingDetails = (listingId) => (e) => {
    const link = "/item/" + listingId;
    history.push(link)
  }

  return (
    <div className="card-container">
      <div className="container">
        {userData.map((user) => (
        <div className="profile-main">
          <Row className="profile" key={user._id} md="auto">
            <Col lg={6} md={6} sm={12}>
              <div className="profile-data">
                <div className="profile-image">
                  <img src={user.avatar}/>
                </div>
                <div className="profile-data-info">
                  <p className="profile-user-name">
                    {user.firstName} {user.lastName}
                  </p>
                  <span>
                    <small>1 2 3 4 5</small>
                  </span>
                </div>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12} className="profile-about">
              <div className="profile-user-settings">
                {id === auth.user._id ? (
                  <Button className="btn profile-edit-btn" onClick={() => setOnEdit(true)}>Edit Profile</Button>
                ) : (
                  <></>
                )}
                <div className="profile-address">
                  <span className="material-icons">place</span>
                  <p className="address">
                    {user.postalCode}, {user.city}
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          {
            onEdit && <EditProfile setOnEdit={setOnEdit}/>
          }
        
        </div>  
        ))}
      </div>

      <div className="card-body">
        <Row>
          <Col lg={12}>
            <div className="heading text-center">
              <h3>Objave</h3>
            </div>
          </Col>
        </Row>

        <Row>
          {listings.map((listing) => (
            <Col className="card-column" lg={3} md={4} sm={6} xs={6} key={listing._id} onClick={handleListingDetails(listing._id)}>
              <Card>
                <Card.Img variant="top" src={listing.photos[0].url}/>
                <Card.Body>
                  <Card.Title>{listing.price} {listing.currency}</Card.Title>
                  <Card.Text>
                    <span className="card-text">{listing.name}</span>
                  </Card.Text>
                  <Card.Text>
                    <p className="card-description">
                      {listing.description}
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ProfileInfo;
