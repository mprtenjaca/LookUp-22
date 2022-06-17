import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router";
import { GLOBALTYPES } from "../../redux/types/globalTypes";
import { getDataAPI } from "../../utils/fetchData";

const SavedListings = ({ auth, dispatch }) => {
  const history = useHistory();

  const [savedListings, setSavedListings] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(2);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);

    getDataAPI("getSavedListings", auth.token)
      .then((res) => {
        setSavedListings(res.data.savedListings);
        setResult(res.data.result);
        setLoad(false);
      })
      .catch((err) => {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
      });
  }, [auth.token, dispatch]);

  const handleListingDetails = (listingId) => (e) => {
    const link = "/item/" + listingId;
    history.push(link);
  };

  return (
    <>
      <Row>
        {savedListings.map((listing) => (
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
                <div className="saved-listing-section">
                  <span className="material-icons">favorite</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default SavedListings;
