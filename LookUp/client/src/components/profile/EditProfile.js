import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkImage } from "../../utils/imageUpload";
import { GLOBALTYPES } from "../../redux/types/globalTypes";
import { updateProfileUser } from "../../redux/actions/profileAction";

import "../../assets/css/edit-profile.css";
import { Col, FormGroup, Row } from "react-bootstrap";

const EditProfile = ({ setOnEdit }) => {
  const initState = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    oib: "",
    street: "",
    streetNumber: "",
    postalCode: "",
    county: "",
    city: "",
  };
  const [userData, setUserData] = useState(initState);
  const {
    firstName,
    lastName,
    username,
    email,
    oib,
    street,
    streetNumber,
    postalCode,
    county,
    city,
    contactPhone,
  } = userData;

  const [avatar, setAvatar] = useState("");

  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData(auth.user);
  }, [auth.user]);

  const changeAvatar = (e) => {
    const file = e.target.files[0];

    const err = checkImage(file);
    if (err)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err },
      });

    setAvatar(file);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfileUser({ userData, avatar, auth }));
  };

  return (
    <div className="edit_profile">
      <button
        className="btn btn-danger btn_close"
        onClick={() => setOnEdit(false)}
      >
        Close
      </button>

      <form onSubmit={handleSubmit}>
        <Row>
          <Row>
            <Col>
              <div className="info_avatar">
                <img
                  src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
                  alt="avatar"
                />
                <span>
                  <i className="fas fa-camera" />
                  <p>Change</p>
                  <input
                    type="file"
                    name="file"
                    id="file_up"
                    accept="image/*"
                    onChange={changeAvatar}
                  />
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <label>First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={handleInput}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <label>Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={handleInput}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleInput}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInput}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <label>Contact phone</label>
                <input
                  type="number"
                  name="contactPhone"
                  value={contactPhone}
                  onChange={handleInput}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <label>OIB</label>
                <input name="oib" value={oib} onChange={handleInput} />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={handleInput}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <label>Postal code</label>
                <input
                  type="number"
                  name="postalCode"
                  value={postalCode}
                  onChange={handleInput}
                />
              </FormGroup>
            </Col>
          </Row>

          <button className="btn btn-info w-100" type="submit">
            Save
          </button>
        </Row>
      </form>
    </div>
  );
};

export default EditProfile;
