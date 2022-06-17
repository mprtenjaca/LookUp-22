import React, { useEffect, useState } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useHistory, useLocation } from "react-router";
import { useRanger } from "react-ranger";
import qs from "qs";

import "../assets/css/profile-card.css";
import "../assets/css/input.css";
import "../assets/css/searched-listings.css";
import "../assets/css/sass/customs.css";

import { productCondition } from "../utils/dropdownConstants";
import { useDispatch, useSelector } from "react-redux";
import { FILTER_TYPES } from "../redux/reducers/filterReducer";
import { getDataAPI } from "../utils/fetchData";
import { GLOBALTYPES } from "../redux/types/globalTypes";
import { SEARCH_TYPES } from "../redux/reducers/searchReducer";

const SearchedListings = (props) => {
  const { auth, searchRed } = useSelector((state) => state);

  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  let searchedString = "";

  const [listings, setListings] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showConditionFilter, setShowConditionFilter] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);

  const [sliderPriceValues, setSliderPriceValues] = useState([1000, 5000]);
  const [sliderPriceFrom, setSliderPriceFrom] = useState(sliderPriceValues[0]);
  const [sliderPriceTo, setSliderPriceTo] = useState(sliderPriceValues[1]);
  const [priceFilterActivated, setPriceFilterActivated] = useState(false);
  const [conditionFilterValues, setConditionFilterValues] = useState([]);

  const handleClosePriceFilter = () => setShowPriceFilter(false);
  const handleShowPriceFilter = () => setShowPriceFilter(true);

  const handleCloseConditionFilter = () => setShowConditionFilter(false);
  const handleShowConditionFilter = () => setShowConditionFilter(true);

  const handleCloseLocationFilter = () => setShowLocationFilter(false);
  const handleShowLocationFilter = () => setShowLocationFilter(true);

  const { getTrackProps, handles } = useRanger({
    values: sliderPriceValues,
    onChange: setSliderPriceValues,
    onDrag: setSliderPriceValues,
    min: 0,
    max: 20000,
    stepSize: 1,
  });

  useEffect(() => {
    const filterParams = history.location.search.substring(1);
    const filtersFromParams = qs.parse(filterParams);
    if (filtersFromParams.conditions) {
      setConditionFilterValues(filtersFromParams.conditions.split(","));
    }
    if (filtersFromParams.price_range) {
      const intList = filtersFromParams.price_range.split(",").map((item) => {
        return parseInt(item);
      });
      setSliderPriceValues(intList);
      setPriceFilterActivated(true);
    }
    fetchListings();
  }, [history, dispatch]);

  useEffect(() => {}, [
    sliderPriceValues,
    sliderPriceFrom,
    sliderPriceTo,
    handles,
  ]);

  const handleFilter = (list) => {
    const url = new URLSearchParams(location.search);
    const filterParams = history.location.search.substring(1);
    const filtersFromParams = qs.parse(filterParams);

    let filteredList = list;
    let isAnyFilterExecuted = false;

    if (url.get("conditions") || conditionFilterValues.length > 0) {
      isAnyFilterExecuted = true;
      filteredList = filteredList.filter((item) => {
        const valuesList =
          conditionFilterValues.length > 0
            ? conditionFilterValues
            : url.get("conditions").split(",");
        return valuesList.some((condition) => {
          return condition === item.condition;
        });
      });
    }

    
    if (filtersFromParams.price_range) {
      isAnyFilterExecuted = true;
      filteredList = filteredList.filter((item) => {
        const priceRange = priceFilterActivated
          ? sliderPriceValues
          : filtersFromParams.price_range.split(",");

        return (
          parseInt(item.price) >= parseInt(priceRange[0]) &&
          parseInt(item.price) <= parseInt(priceRange[1])
        );
      });
    }

    return isAnyFilterExecuted ? filteredList : list;
  };

  const fetchListings = async (e) => {
    const filterParams = history.location.search.substring(1);
    const filtersFromParams = qs.parse(filterParams);
    searchedString = filtersFromParams.keywords;

    try {
      const url = new URLSearchParams(location.search);
      const res = await getDataAPI(`search${location.search}`, auth.token);
      setListings(res.data.listings);
      setOriginalList(res.data.listings);
      dispatch({
        type: SEARCH_TYPES.SEARCH_FILTER,
        payload: res.data.listings,
      });

      const filteredList = handleFilter(res.data.listings);
      setListings(filteredList);
    } catch (err) {
      console.log(err);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response },
      });
    }
  };

  const handleItemConditionFilter = (value) => (e) => {
    if (e.target.checked) {
      setConditionFilterValues([...conditionFilterValues, value]);
    } else {
      setConditionFilterValues(
        conditionFilterValues.filter((v) => v !== value)
      );
    }
  };

  const handleApplyConditionFilter = (e) => {

    const url = new URLSearchParams(location.search);
    if (!url.get("conditions") && conditionFilterValues.length > 0) {
      url.set("conditions", conditionFilterValues);
      const newURL = new URLSearchParams(url);
      history.push({
        pathname: "/search",
        search: "?" + newURL,
      });
    } else {
      if (conditionFilterValues.length > 0) {
        url.set("conditions", conditionFilterValues);
      } else {
        url.delete("conditions");
      }

      const newURL = new URLSearchParams(url);
      history.push({
        pathname: "/search",
        search: "?" + newURL,
      });
    }

    if (conditionFilterValues.length > 0) {
      const filteredList = handleFilter(originalList);
      setListings(filteredList);
    } else {
      setListings(originalList);
    }

    handleCloseConditionFilter();
  };

  const handleApplyPriceFilter = (e) => {
    setPriceFilterActivated(true);

    const url = new URLSearchParams(location.search);
    if (!url.get("price_range") && sliderPriceValues.length > 0) {
      url.set("price_range", sliderPriceValues);
      const newURL = new URLSearchParams(url);
      history.push({
        pathname: "/search",
        search: "?" + newURL,
      });
    } else {
      if (sliderPriceValues.length > 0) {
        url.set("price_range", sliderPriceValues);
      } else {
        url.delete("price_range");
      }

      const newURL = new URLSearchParams(url);
      history.push({
        pathname: "/search",
        search: "?" + newURL,
      });
    }

    if (sliderPriceValues.length > 0) {
      const filteredList = handleFilter(originalList);
      setListings(filteredList);
    } else {
      setListings(originalList);
    }

    handleClosePriceFilter();
  };

  const handleChangeSliderPrice = (e) => {
    const copy = sliderPriceValues;
    const value = parseInt(e.target.value);

    if (e.target.name === "sliderPriceFrom") {
      setSliderPriceFrom(value);
      handles[0].value = value;
      copy[0] = value;
    }
    if (e.target.name === "sliderPriceTo") {
      setSliderPriceTo(value);
      handles[1].value = value;
      copy[1] = value;
    }

    setSliderPriceValues(copy);
  };

  const handleListingDetails = (listingId) => (e) => {
    const link = "/item/" + listingId;
    history.push(link);

    // TODO: PROBAJ MOZDA NAPRAVIT DA IDE PRKO ID FOLDERA KO ITEM KATEGORIJA I PROFIL
  };

  return (
    <div className="card-container">
      {console.log(sliderPriceValues)}

      <div className="search-filter">
        <ul>
          <li>
            <div className="filter-div">Filters:</div>
          </li>
          <li onClick={handleShowPriceFilter}>
            <div
              className={`filter-div ${
                priceFilterActivated ? "active-filter-div" : ""
              }`}
            >
              <span className="material-icons-outlined">paid</span>
              {priceFilterActivated
                ? sliderPriceValues[0] + " - " + sliderPriceValues[1]
                : "Price range"}
            </div>
          </li>
          <li onClick={handleShowConditionFilter}>
            <div
              className={`filter-div ${
                conditionFilterValues.length === 0 ? "" : "active-filter-div"
              }`}
            >
              <span className="material-icons-outlined">auto_awesome</span>
              {conditionFilterValues.length === 0
                ? "Item Condition"
                : conditionFilterValues.length + " conditions"}
            </div>
          </li>
          <li>
            <div className="filter-div">
              <span className="material-icons-outlined">place</span>Location
            </div>
          </li>
        </ul>
      </div>

      {listings.length === 0 ? (
        <h1 className="category-heading">No results for "{searchedString}"</h1>
      ) : (
        ""
      )}
      <div className="card-body">
        <Row>
          {listings.map((listing) => (
            <Col
              key={listing._id}
              className="card-column"
              lg={3}
              md={4}
              sm={4}
              xs={6}
              onClick={handleListingDetails(listing._id)}
            >
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

          {listings.length === 0 ? (
            <h2>No listings in this category</h2>
          ) : (
            <></>
          )}
        </Row>
      </div>
      <Modal show={showPriceFilter} onHide={handleClosePriceFilter}>
        <Modal.Header closeButton>
          <Modal.Title>Price range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12} className="slider">
              <div className="slider-div" {...getTrackProps()}>
                {handles.map(({ getHandleProps }) => (
                  <button className="slider-btn" {...getHandleProps()} />
                ))}
              </div>
            </Col>
            <br />
            <Col md={6}>
              <label>From:</label>
              <input
                type="number"
                name="sliderPriceFrom"
                onChange={handleChangeSliderPrice}
                value={sliderPriceValues[0]}
              />
            </Col>

            <Col md={6}>
              <label>To:</label>
              <input
                type="number"
                name="sliderPriceTo"
                onChange={handleChangeSliderPrice}
                value={
                  sliderPriceValues[1] === parseInt("20000")
                    ? ""
                    : sliderPriceValues[1]
                }
                placeholder={
                  sliderPriceValues[1] === parseInt("20000") ? "No limit" : ""
                }
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Col className="close-btn" onClick={handleClosePriceFilter}>
            <button>Close</button>
          </Col>
          <Col className="chat-btn" onClick={handleApplyPriceFilter}>
            <button>Apply</button>
          </Col>
        </Modal.Footer>
      </Modal>

      <Modal show={showConditionFilter} onHide={handleCloseConditionFilter}>
        <Modal.Header closeButton>
          <Modal.Title>Item condition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="conditions">
            {productCondition.map((itemCondition) => {
              return (
                <Col
                  key={itemCondition.condition}
                  md={12}
                  className="condition-column"
                >
                  <span>{itemCondition.condition}</span>
                  <input
                    type="checkbox"
                    checked={
                      conditionFilterValues.filter(
                        (c) => c === itemCondition.condition
                      ).length > 0
                        ? true
                        : false
                    }
                    value={itemCondition.condition}
                    onChange={handleItemConditionFilter(
                      itemCondition.condition
                    )}
                  />
                </Col>
              );
            })}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Col className="close-btn" onClick={handleCloseConditionFilter}>
            <button>Close</button>
          </Col>
          <Col className="chat-btn" onClick={handleApplyConditionFilter}>
            <button>Apply</button>
          </Col>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SearchedListings;
