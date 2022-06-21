import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/types/globalTypes";

import "../../assets/css/listing.css";
import camera from "../../assets/images/camera.ico";

import { categories } from "../../utils/categoriesConstants";
import { checkImage } from "../../utils/imageUpload";
import { validateListing } from "../../utils/validate";
import { createListing, getListing, updateListing } from "../../redux/actions/listingAction";
import { socket } from "../../redux/socket";
import { productCondition } from "../../utils/dropdownConstants";
import { useHistory, useParams } from "react-router";

const EditItem = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const { auth, detailItem, alert } = useSelector((state) => state);

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
  };

  const [currentCategory, setCurrentCategory] = useState([]);
  const [productData, setProductData] = useState(initialState);
  const [oldImages, setOldImages] = useState([]);
  const [avatar, setAvatar] = useState("");

  const { name, description, category, subCategory, condition, currency, price, city, postalCode, photos, user } = productData;

  useEffect(() => {
    dispatch(getListing({ detailItem, id, auth }));

    if (detailItem.length > 0) {
      const newArr = detailItem.filter((item) => item._id === id);
      setOldImages(newArr.photos);
      setProductData(newArr[0]);
      // setCurrentCategory(newArr[0].category)
      categories.filter((item) => {
        if (newArr[0].category === item.path) {
          setCurrentCategory(item.sub);
        }
      });
    }
  }, [detailItem, dispatch, id, auth]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });

    if (name === "category") {
      categories.filter((item) => {
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

    if (index + 1 > photosCopy.length && photosCopy.length != 0) {
      photosCopy[index + 1 - photosCopy.length] = file;
    }

    setProductData({ ...productData, photos: photosCopy });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const valid = validateListing(productData);

    if (valid.errLength > 0) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: valid.errMsg,
      });
    }

    if (photos.length === 0) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "You should upload at least one image" },
      });
    }

    dispatch(updateListing({ productData, auth, socket }));
    history.push("/profile/" + auth.user._id);
  };

  return (
    <>
      <div className="new-listing-container">
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
                  <input className={alert.name ? "error" : ""} placeholder="In some words..." type="text" value={name} name="name" onChange={handleChangeInput} />
                </Col>
              </Row>
            </FormGroup>

            <FormGroup>
              <Row>
                <Col md={6} sm={6} xs={6}>
                  <label>Category</label>
                  <br />
                  <select name="category" className="dropdown-select" onChange={handleChangeInput}>
                    {categories.map((item, index) => (
                      <option key={index} selected={productData.category === item.path ? true : false} name="category" className="dropdown-select" value={item.path}>
                        {item.heading}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col md={4} sm={6} xs={6}>
                  <label>Price</label>
                  <br />
                  <input className={alert.price ? "error" : ""} placeholder="Name your price" type="number" value={price} name="price" onChange={handleChangeInput} />
                </Col>
                <Col md={2} sm={6} xs={6} className="custom-col currency">
                  <label>Currency</label>
                  <br />
                  <select name="currency" className="dropdown-select" onChange={handleChangeInput}>
                    <option selected={productData.currency === 'HRK' ? true : false} name="currency" key="HRK" value="HRK">
                      HRK
                    </option>
                    <option selected={productData.currency === 'EUR' ? true : false} name="currency" key="EUR" value="EUR">
                      EUR
                    </option>
                  </select>
                </Col>
                <Col md={6} sm={6} xs={6} className="custom-col">
                  <label>Subategory</label>
                  <br />
                  <select name="subCategory" className="dropdown-select" placeholder="TEST" onChange={handleChangeInput}>
                    {currentCategory.map((item, index) => (
                      <option key={index} selected={productData.subCategory === item.name ? true : false} disabled={currentCategory.length === 0 ? true : false} name="subCategory" className="dropdown-select" value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Col>

                <Col md={6} className="custom-col">
                  <label>Condition</label>
                  <br />
                  <select name="condition" className="dropdown-select" onChange={handleChangeInput}>
                    {productCondition.map((item, index) => (
                      <option key={index} selected={productData.condition === item.condition ? true : false} name="condition" className="dropdown-select" value={item.condition}>
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
                <Col md={3} sm={3} xs={6}>
                  <label className={`photo-upload ${photos[0] ? "photoHover" : ""}`} style={photos[0] ? { border: "none" } : {}}>
                    {photos[0] ? (
                      <img src={photos[0] ? (photos[0].url ? photos[0].url : URL.createObjectURL(photos[0])) : camera} style={photos[0] ? { objectFit: "cover" } : { objectFit: "contain" }} />
                    ) : (
                      <span className="material-icons-outlined upload-icon">photo_camera</span>
                    )}
                    <input type="file" name="file" id="file_up" accept="image/*" onChange={handleImageUpload(0)} hidden />
                  </label>
                  <p className="main-image">MAIN PHOTO</p>
                </Col>
                <Col md={3} sm={3} xs={6}>
                  <label className={`photo-upload ${photos[1] ? "photoHover" : ""}`} style={photos[1] ? { border: "none" } : {}}>
                    {photos[1] ? (
                      <img src={photos[1] ? (photos[1].url ? photos[1].url : URL.createObjectURL(photos[1])) : camera} style={photos[1] ? { objectFit: "cover" } : { objectFit: "contain" }} />
                    ) : (
                      <span className="material-icons-outlined upload-icon">photo_camera</span>
                    )}
                    <input type="file" name="file" id="file_up" accept="image/*" onChange={handleImageUpload(1)} hidden />
                  </label>
                </Col>
                <Col md={3} sm={3} xs={6}>
                  <label className={`photo-upload ${photos[2] ? "photoHover" : ""}`} style={photos[2] ? { border: "none" } : {}}>
                    {photos[2] ? (
                      <img src={photos[2] ? (photos[2].url ? photos[2].url : URL.createObjectURL(photos[2])) : camera} style={photos[2] ? { objectFit: "cover" } : { objectFit: "contain" }} />
                    ) : (
                      <span className="material-icons-outlined upload-icon">photo_camera</span>
                    )}
                    <input type="file" name="file" id="file_up" accept="image/*" onChange={handleImageUpload(2)} hidden />
                  </label>
                </Col>
                <Col md={3} sm={3} xs={6}>
                  <label className={`photo-upload ${photos[3] ? "photoHover" : ""}`} style={photos[3] ? { border: "none" } : {}}>
                    {photos[3] ? (
                      <img src={photos[3] ? (photos[3].url ? photos[3].url : URL.createObjectURL(photos[3])) : camera} style={photos[3] ? { objectFit: "cover" } : { objectFit: "contain" }} />
                    ) : (
                      <span className="material-icons-outlined upload-icon">photo_camera</span>
                    )}
                    <input type="file" name="file" id="file_up" accept="image/*" onChange={handleImageUpload(3)} hidden />
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
                  <label>City</label>
                  <input className={alert.city ? "error" : ""} type="text" name="city" placeholder="" value={city} onChange={handleChangeInput} />
                </Col>
                <Col lg={2}>
                  <label>Postal code</label>
                  <input className={alert.postalCode ? "error" : ""} type="text" name="postalCode" placeholder="" value={postalCode} onChange={handleChangeInput} />
                </Col>
              </Row>
            </FormGroup>
            <Row className="post-row">
              <Col md={12}>
                <button type="submit" className="submit-button">
                  SAVE CHANGES
                </button>
              </Col>
            </Row>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default EditItem;
