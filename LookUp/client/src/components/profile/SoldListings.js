import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router";

const SoldListings = ({ auth, profile, listings, id, dispatch }) => {
  const history = useHistory()

  const [soldListings, setSoldListings] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const sellingListings = listings.listings.filter((listing) => listing.isSold === true);
    setSoldListings(sellingListings);
    setResult(listings.result);
  }, [id, auth.user, dispatch, listings]);

  const handleListingDetails = (listingId) => (e) => {
    const link = "/item/" + listingId;
    history.push(link);
  };

  return (
    <>
      <Row>
        {soldListings.map((listing) => (
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
      </Row>
    </>
  );
};

export default SoldListings;
