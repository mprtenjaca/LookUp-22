import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import ItemInfo from '../../components/item/ItemInfo'
import { getListing } from '../../redux/actions/listingAction'

import "../../assets/css/profile-card.css";

const Item = () => {

    const { id } = useParams()
    const dispatch = useDispatch()

    const { auth, detailItem } = useSelector(state => state)
    const [item, setItem] = useState([])
    const [itemUser, setItemUser] = useState()

    useEffect(() => {

      dispatch(getListing({detailItem, id, auth}))

      if(detailItem.length > 0){
        const newArr = detailItem.filter(item => item._id === id)
        setItem(newArr)
      }

    }, [detailItem, dispatch, id, auth])

  return (
    <>
      <ItemInfo item={item} user={auth.user}/>
    </>
  )
}

export default Item
