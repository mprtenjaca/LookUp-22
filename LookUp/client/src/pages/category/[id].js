import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getCategoryItems } from "../../redux/actions/categoryAction";
import { categories } from "../../utils/categoriesConstants";

import CategoryListings from "../../components/item/CategoryListings";


const Category = () => {
    const { auth, categoryListings } = useSelector(state => state)
    const dispatch = useDispatch()
    const { id } = useParams()

    useEffect(() => {
        const currentCategory = categories
        .filter((cat) => cat.path === id)
        .map((cat) => cat.path)

        dispatch(getCategoryItems(currentCategory[0], auth))

        // if(categoryListings.listings.length > 0){
        //     const newArr = categoryListings.listings.filter(item => item.category === id)
        //     setListingsData(newArr)
        // }

    }, [id, auth, dispatch])

    return (
        <>
            <CategoryListings id={id} auth={auth} categoryListings={categoryListings.listings} dispatch={dispatch}/>
        </>
    );
};

export default Category;
