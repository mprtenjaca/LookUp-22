import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import NotFound from '../../components/NotFound';
import { UTIL_TYPES } from '../../redux/reducers/utilReducer';

const generatePage = (pageName) => {
    const component = () => require(`../../pages/${pageName}.js`).default;

    try{
        return React.createElement(component())
    }catch (err){
        console.log(err)
        return <NotFound/>
    }
}

const PageRender = () => {
    const dispatch = useDispatch();
    const {page, id} = useParams();
    const {auth} = useSelector(state => state);

    let pageName = "";

    if(auth.token){
        
        if(id){
            pageName = `${page}/[id]`;
        }else{
            pageName = `${page}`;
        }

    }
    
    if(pageName === 'new-listing'){
        pageName = 'NewListing'
    }

    if(pageName === 'search'){
        pageName = 'SearchedListings'
    }

    if(pageName === 'message'){
        pageName = 'Message'
    }

    // if(pageName === 'message/[id]'){
    //     dispatch({type: UTIL_TYPES.HEADER_DISPLAY, payload: true})
    // }
    //else{
    //     dispatch({type: UTIL_TYPES.HEADER_DISPLAY, payload: false})
    // }

    return generatePage(pageName);
}

export default PageRender;
