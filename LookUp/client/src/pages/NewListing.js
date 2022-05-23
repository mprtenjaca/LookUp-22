import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../redux/types/globalTypes";
import { useParams } from "react-router";

import "../assets/css/listing.css";
import { categories } from "../utils/categoriesConstants";
import { productCondition } from "../utils/dropdownConstants";
import camera from "../assets/images/camera.ico";
import { checkImage, imageUpload } from "../utils/imageUpload";
import { createListing } from "../redux/actions/listingAction";
import { validateListing } from "../utils/validate";

const NewListing = () => {
  const dispatch = useDispatch();
  const { auth, alert } = useSelector((state) => state);

  const initialState = {
    name: "",
    description: "",
    category: "All categories",
    subCategory: "Default",
    condition: "New",
    currency: "HRK",
    price: "",
    city: "",
    postalCode: "",
    photos: [],
    user: auth.user._id,
  };

  const [currentCategory, setCurrentCategory] = useState([]);
  const [productData, setProductData] = useState(initialState);
  const [avatar, setAvatar] = useState("");

  const {
    name,
    description,
    category,
    subCategory,
    condition,
    currency,
    price,
    city,
    postalCode,
    photos,
    user,
  } = productData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });

    if (name === "category") {
      categories.filter((item) => {
        console.log(item.heading)
        if (item.path === value) {
          setCurrentCategory(item.sub);
        }
      });
    }
  };
  const handleImageUpload = (index) => (e) => {
    const file = e.target.files[0];

    const err = checkImage(file);
    if (err) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err },
      });
    }

    let photosCopy = [...photos];

    if (photosCopy.length === 0) {
      photosCopy[0] = file;
    } else {
      photosCopy[index] = file;
    }

    // if((index + 1) > photosCopy.length && photosCopy.length != 0){
    //   photosCopy[(index + 1) - photosCopy.length] = file
    // }

    setProductData({ ...productData, photos: photosCopy });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const valid = validateListing(productData)

    if(valid.errLength > 0){
      return dispatch({ 
        type: GLOBALTYPES.ALERT, payload: valid.errMsg
      })
    }

    if(photos.length === 0){
      return dispatch({ 
        type: GLOBALTYPES.ALERT, payload: {error: "You should upload at least one image"}
      })
    }

    dispatch(createListing({ productData, auth }));
  };

  return (
    <>
    {console.log(productData)}
      <div className="container">
        <Form onSubmit={handleSubmit}>
          <Row>
          <Row>
            <Col lg={12} className="listing-heading">
              <h6>INFORMATION ABOUT YOUR ITEM</h6>
            </Col>
          </Row>
          <FormGroup>
            <Row>
              <Col lg={12}>
                <label>What are you selling?</label>
                <br />
                <input
                  className={alert.name ? "error" : ""}
                  placeholder="In some words..."
                  type="text"
                  value={name}
                  name="name"
                  onChange={handleChangeInput}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col md={6}>
                <label>Category</label>
                <br />
                <select
                  name="category"
                  className="dropdown-select"
                  onChange={handleChangeInput}
                >
                  {categories.map((item, index) => (
                    <option
                      key={index}
                      name="category"
                      className="dropdown-select"
                      value={item.path}
                    >
                      {item.heading}
                    </option>
                  ))}
                </select>
              </Col>
              <Col md={4}>
                <label>Price</label>
                <br />
                <input
                  className={alert.price ? "error" : ""}
                  placeholder="Name your price"
                  type="number"
                  value={price}
                  name="price"
                  onChange={handleChangeInput}
                />
              </Col>
              <Col md={2}>
                <label>Currency</label>
                <br />
                <select
                  name="currency"
                  className="dropdown-select"
                  onChange={handleChangeInput}
                >
                  <option selected name="currency" key="HRK" value="HRK">
                    HRK
                  </option>
                  <option name="currency" key="EUR" value="EUR">
                    EUR
                  </option>
                </select>
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col md={6}>
                <label>Subategory</label>
                <br />
                <select
                  name="subCategory"
                  className="dropdown-select"
                  placeholder="TEST"
                  onChange={handleChangeInput}
                  disabled={currentCategory.length === 0 ? true : false}
                >
                  {currentCategory.map((item, index) => (
                    <option
                      key={index}
                      name="subCategory"
                      className="dropdown-select"
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </Col>

              <Col md={6}>
                <label>Condition</label>
                <br />
                <select
                  name="condition"
                  className="dropdown-select"
                  onChange={handleChangeInput}
                >
                  {productCondition.map((item, index) => (
                    <option
                      key={index}
                      name="condition"
                      className="dropdown-select"
                      value={item.condition}
                    >
                      {item.condition}
                    </option>
                  ))}
                </select>
              </Col>
              <FormGroup>
                <Row>
                  <Col md={12}>
                    <label>Description</label>
                    <textarea
                      className={alert.description ? "error" : ""}
                      rows="6"
                      placeholder="Add relevant information such as condition, model, color..."
                      name="description"
                      value={description}
                      onChange={handleChangeInput}
                    />
                  </Col>
                </Row>
              </FormGroup>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col lg={12} className="listing-heading">
                <h6>PHOTOS</h6>
              </Col>
            </Row>
            <Row>
              <Col lg={3}>
                <label
                  className={`photo-upload ${photos[0] ? "photoHover" : ""}`}
                  style={photos[0] ? { border: "none" } : {}}
                >
                  {photos[0] ? (
                    <img
                      src={photos[0] ? URL.createObjectURL(photos[0]) : camera}
                      style={
                        photos[0]
                          ? { objectFit: "cover" }
                          : { objectFit: "contain" }
                      }
                    />
                  ) : (
                    <span className="material-icons-outlined upload-icon">
                      photo_camera
                    </span>
                  )}
                  <input
                    type="file"
                    name="file"
                    id="file_up"
                    accept="image/*"
                    onChange={handleImageUpload(0)}
                    hidden
                  />
                </label>
                <p className="main-image">MAIN PHOTO</p>
              </Col>
              <Col lg={3}>
                <label
                  className={`photo-upload ${photos[1] ? "photoHover" : ""}`}
                  style={photos[1] ? { border: "none" } : {}}
                >
                  {photos[1] ? (
                    <img
                      src={photos[1] ? URL.createObjectURL(photos[1]) : camera}
                      style={
                        photos[1]
                          ? { objectFit: "cover" }
                          : { objectFit: "contain" }
                      }
                    />
                  ) : (
                    <span className="material-icons-outlined upload-icon">
                      photo_camera
                    </span>
                  )}
                  <input
                    type="file"
                    name="file"
                    id="file_up"
                    accept="image/*"
                    onChange={handleImageUpload(1)}
                    hidden
                  />
                </label>
              </Col>
              <Col lg={3}>
                <label
                  className={`photo-upload ${photos[2] ? "photoHover" : ""}`}
                  style={photos[2] ? { border: "none" } : {}}
                >
                  {photos[2] ? (
                    <img
                      src={photos[2] ? URL.createObjectURL(photos[2]) : camera}
                      style={
                        photos[2]
                          ? { objectFit: "cover" }
                          : { objectFit: "contain" }
                      }
                    />
                  ) : (
                    <span className="material-icons-outlined upload-icon">
                      photo_camera
                    </span>
                  )}
                  <input
                    type="file"
                    name="file"
                    id="file_up"
                    accept="image/*"
                    onChange={handleImageUpload(2)}
                    hidden
                  />
                </label>
              </Col>
              <Col lg={3}>
                <label
                  className={`photo-upload ${photos[3] ? "photoHover" : ""}`}
                  style={photos[3] ? { border: "none" } : {}}
                >
                  {photos[3] ? (
                    <img
                      src={photos[3] ? URL.createObjectURL(photos[3]) : camera}
                      style={
                        photos[3]
                          ? { objectFit: "cover" }
                          : { objectFit: "contain" }
                      }
                    />
                  ) : (
                    <span className="material-icons-outlined upload-icon">
                      photo_camera
                    </span>
                  )}
                  <input
                    type="file"
                    name="file"
                    id="file_up"
                    accept="image/*"
                    onChange={handleImageUpload(3)}
                    hidden
                  />
                </label>
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col lg={12} className="listing-heading">
                <h6>YOUR PRODUCTS ARE IN:</h6>
              </Col>
            </Row>
            <Row>
              <Col lg={2}>
                <input
                  className={alert.city ? "error" : ""}
                  type="text"
                  name="city"
                  placeholder="City"
                  value={city}
                  onChange={handleChangeInput}
                />
              </Col>
              <Col lg={2}>
                <input
                  className={alert.postalCode ? "error" : ""}
                  type="text"
                  name="postalCode"
                  placeholder="Postal code"
                  value={postalCode}
                  onChange={handleChangeInput}
                />
              </Col>
            </Row>
          </FormGroup>
          <Row>
            <Col md={12}>
              <Button type="submit" className="submit-button">SUBMIT</Button>
            </Col>
          </Row>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default NewListing;
