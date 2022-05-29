import React, { Profiler, useEffect, useRef, useState } from 'react'
import { Button, Carousel, CarouselItem, Col, Row } from 'react-bootstrap'
import moment from 'moment'
import {Wrapper} from '@googlemaps/react-wrapper'

import '../../assets/css/item-detail.css'
import { useHistory } from 'react-router'
import { MESS_TYPES } from '../../redux/actions/messageAction'
import { useDispatch } from 'react-redux'

const ItemInfo = ({item, user}) => {

  const ref = useRef(null)
  const history = useHistory()
  const dispatch = useDispatch()
  const [map, setMap] = useState()

  const handleChat = (itemUser) => (e) => {
    dispatch({type: MESS_TYPES.ADD_USER, payload: {...itemUser, text: '', media: []}})
    return history.push('/message/' + itemUser._id)
  }

  return (
    <div className='item-container'>
    {
      item.map((itemDetail) => (
      <div className='item' key={itemDetail._id}>
        <div className='test'>
          <div>

            <Row className='item-path'>
              <Col md={12}>
                <span>{itemDetail.category} / {itemDetail.subCategory} / {itemDetail.city} / {itemDetail.name}</span>
              </Col>
            </Row>


            <Row className='user-header'>
              <Col md={2} sm={4} xs={2} className="user-image">
                
                <img src={itemDetail.user.avatar}/>
              </Col>
              <Col md={4} sm={8} xs={10} className="user-name">
                <h5>{itemDetail.user.firstName} {itemDetail.user.lastName}</h5>
              </Col>

              <Col md={6} sm={12} xs={12} className="chat-btn">
                <button onClick={handleChat(itemDetail.user)}>Chat to buy</button>
              </Col>
            </Row>


            <Row>
              <Col md={12} className="item-image">
                  <Carousel interval={null}>
                    {
                      itemDetail.photos.map((photo) => (
                        <CarouselItem>
                          <img src={photo.url}/>
                        </CarouselItem>
                      ))
                    }
                  </Carousel>
                
              </Col>
            </Row>

            <Row className="item-info">
              <Col md={12}>
                <span className="item-price">{itemDetail.price} {itemDetail.currency}</span>
              </Col>
              <Col md={12}>
                <h1>{itemDetail.name}</h1>
              </Col>
              <Col md={12}>
                <span>{itemDetail.condition}</span>
              </Col>

              <Col md={12} className="category">
                <ul className='category-list'>
                  <li>
                  <span>{itemDetail.category}</span>
                  </li>
                  <li>
                  <span className='subcategoty'>{itemDetail.subCategory}</span>
                  </li>
                </ul>
              </Col>
            </Row>

            <Row>
              <Col md={12} className="created-at">
                {moment(itemDetail.createdAt).format("DD-MMM-YYYY")}
              </Col>
            </Row>

            <Row>
              <Col md={12} className="location">
                <span className='material-icons-outlined'>place</span>
                <p>{itemDetail.city} {itemDetail.postalCode}</p>
              </Col>

              <Col md={12}>
                <Wrapper apiKey='AIzaSyBY6NJ4ZD8X6BiVYayK-wt5RXJrrOimg5o'>
                  {/* <h1>test</h1> */}
                </Wrapper>
              </Col>

            </Row>
          </div>
        </div>
      </div>
      ))
    }
    </div>
    
  )
}

export default ItemInfo;
