import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Col, Row } from "react-bootstrap";
import { categories } from "../utils/categoriesConstants";
import { colors } from "../utils/colors";

const Home = () => {
  const { auth } = useSelector((state) => state);

  const generateColor1 = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  };

  const generateColor = () => {
    const color = colors[Math.floor(Math.random() * colors.length)]
    return color.color;
  };

  return (
    <>
      <div className="home home-container">
        <div className="row text-center" style={{ marginTop: "80px" }}>
          <div className="col">
            <h1>What are you looking for today?</h1>
          </div>
        </div>
        {/* <Row className="text-center">
          <div className="col main-home">
            <ul className="navbar-nav flex-row disable-select">
              {categories.map((link, index) => (
                <Col lg={3} md={3} sm={3} xs={6}>
                <li className={`nav-item px-2 ${link.path}`} key={index}>
                  <Link className="nav-link" to={"/category/" + link.path}>
                    <span className="material-icons-outlined">{link.icon}</span>
                    <p>{link.heading}</p>
                  </Link>
                </li>
                </Col>
              ))}
            </ul>
          </div>
        </Row> */}

        <Row className="home-categories text-center">
            {categories.map((link, index) => (
              <Col lg={3} md={3} sm={4} xs={6} key={index}>
                  <Link className="nav-link" to={"/category/" + link.path} style={{backgroundColor: generateColor()}}>
                    <span className="material-icons-outlined">{link.icon}</span>
                    <p>{link.heading}</p>
                  </Link>
              </Col>
            ))}
        </Row>

        {/* <div className="home-body">
          <Row className="row">
            <div className="card product-info-card" title="Opel Corsa 2011">
              <div className="card-img">
                <img className="card-img-top" src="https://cdn.wallapop.com/images/10420/cv/xh/__/c10420p779224722/i2609843987.jpg?pictureSize=W320" alt="Card image cap" />
              </div>
              <div className="card-body">
                <div>
                  <span className="card-title">$2,300</span>
                </div>
                <span className="card-text">Opel Corsa 2011</span>
                <ul className="card-info">
                  <li>Gas</li>
                  <li>Manual</li>
                  <li>250 cv</li>
                  <li>2006</li>
                  <li>69.486 km</li>
                </ul>
                <p className="card-description">
                  vendo bmw en buen estado,filtros y aceite cambiados en marzo sdf sdf sdf dasd asd asd a ds asd asd a asdasdsd ased sinemblos casquillos de bielas juntas y más cosas ver y probar sin
                  compromiso. BMW Serie 3 Sedan
                </p>
              </div>
            </div>
          </Row>
        </div> */}
      </div>
    </>
  );
};

export default Home;
