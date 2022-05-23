import React, { Profiler, useEffect, useRef, useState } from "react";
import { Button, Card, Carousel, CarouselItem, Col, Row } from "react-bootstrap";
import moment from "moment";
import { Wrapper } from "@googlemaps/react-wrapper";
import { categories } from "../../utils/categoriesConstants";

import "../../assets/css/profile-card.css";
import "../../assets/css/category-listings.css";
import { useHistory } from "react-router";

const CategoryListings = ({ id, auth, categoryListings, dispatch }) => {
  const [listingsData, setListingsData] = useState([]);
  const history = useHistory();

  const categoryName = categories.filter((cat) => cat.path === id).map((cat) => cat.heading);

  useEffect(() => {
    const newArr = categoryListings.filter((item) => item.category === id);
    setListingsData(newArr);
  }, [categoryListings.listings]);

  const handleListingDetails = (listingId) => (e) => {
    const link = "/item/" + listingId;
    history.push(link);
  };

  return (
    <div className="card-container">
      <div className="card-body">
        <h1 className="category-heading">{categoryName}</h1>
        <Row className="category-body">
          {categoryListings.length === 0 ? (
            <></>
          ) : (
            <Col md={12} className="category-novelties">
              <h2>Novalties</h2>
            </Col>
          )}
          {categoryListings.map((listing) => (
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

          {categoryListings.length === 0 ? <h2>No listings in this category</h2> : <></>}
        </Row>
      </div>
    </div>
  );
};

export default CategoryListings;
