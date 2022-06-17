import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import NotFound from '../../components/NotFound';

const generatePage = (pageName, alert) => {
    const component = () => require(`../../pages/${pageName}.js`).default;

    try{
        return React.createElement(component())
    }catch (err){
        return !alert.loading && <NotFound/>
    }
}

const PageRender = () => {
    const dispatch = useDispatch();
    const {page, id} = useParams();
    const {auth, alert} = useSelector(state => state);

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

    return generatePage(pageName, alert);
}

export default PageRender;
