import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "../assets/styles/global.css";
import "../assets/css/sass/home.css";
import { Row } from "react-bootstrap";
import { categories } from "../utils/categoriesConstants";



const Home = () => {
  const { auth } = useSelector((state) => state);
  return (
    <>
      <div className="home home-container">
        <div className="row text-center" style={{ marginTop: "80px" }}>
          <div className="col">
            <h1>What are you looking for today?</h1>
          </div>
        </div>
        <div className="row text-center">
          <div className="col main-home">
            <ul className="navbar-nav flex-row">
              {categories.map((link, index) => (
                <li className={`nav-item px-2 ${link.path}`} key={index}>
                  <Link className="nav-link" to={"/category/" + link.path}>
                    <span className="material-icons-outlined">{link.icon}</span>
                    <p>{link.heading}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="home-body">
          <Row className="row">
            <div className="card product-info-card" title="Opel Corsa 2011">
              <div className="card-img">
                <img
                    className="card-img-top"
                    src="https://cdn.wallapop.com/images/10420/cv/xh/__/c10420p779224722/i2609843987.jpg?pictureSize=W320"
                    alt="Card image cap"
                  />
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
                {/* <div><span>Gas</span> - <span>85 cv</span></div> */}
                <p className="card-description">
                vendo bmw en buen estado,filtros y aceite cambiados en marzo sdf sdf sdf  dasd asd asd a ds asd asd a asdasdsd ased  sinemblos casquillos de bielas juntas y más cosas ver y probar sin compromiso. BMW Serie 3 Sedan                
                </p>
              </div>
            </div>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Home;
