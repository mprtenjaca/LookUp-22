import React from 'react'
import { Carousel, CarouselItem, Col, Row } from 'react-bootstrap'
import moment from 'moment'

import '../../assets/css/item-detail.css'
import { useHistory } from 'react-router'
import { MESS_TYPES } from '../../redux/actions/messageAction'
import { useDispatch, useSelector } from 'react-redux'

import UserCard from '../user/UserCard'
import { categories } from '../../utils/categoriesConstants'

const ItemInfo = ({item, user}) => {
  const { auth } = useSelector((state) => state);

  const history = useHistory()
  const dispatch = useDispatch()

  const handleChat = (itemUser, itemDetail) => (e) => {
    dispatch({type: MESS_TYPES.ADD_USER, payload: {...itemUser, text: '', listing: itemDetail}})
    return history.push('/message/' + itemUser._id + "?itemId=" + itemDetail._id)
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
                <span>{categories.filter(category => category.path === itemDetail.category).map(category => category.heading)} / {itemDetail.subCategory} / {itemDetail.city} / {itemDetail.name}</span>
              </Col>
            </Row>


            <Row className='user-header'>
              <UserCard user={itemDetail.user}/>
              {/* <Col md={2} sm={4} xs={2} className="user-image">
                
                <img src={itemDetail.user.avatar}/>
              </Col>
              <Col md={4} sm={8} xs={10} className="user-name">
                <h5>{itemDetail.user.firstName} {itemDetail.user.lastName}</h5>
              </Col> */}

              {
                auth.user._id === itemDetail.user._id ? '' :
                <Col md={6} sm={12} xs={12} className="chat-btn">
                  <button onClick={handleChat(itemDetail.user, itemDetail)}>Chat to buy</button>
                </Col>
              }
              
            </Row>


            <Row>
              <Col md={12} className="item-image">
                  <Carousel interval={null}>
                    {
                      itemDetail.photos.map((photo, index) => (
                        <CarouselItem key={index}>
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
                  <span onClick={() => history.push('/category/' + itemDetail.category)}>
                    {
                      categories.filter(category => category.path === itemDetail.category).map(category => category.heading)
                    }
                  </span>
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

              {/* <Col md={12}>
                <Wrapper apiKey='AIzaSyBY6NJ4ZD8X6BiVYayK-wt5RXJrrOimg5o'>
                </Wrapper>
              </Col> */}

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
