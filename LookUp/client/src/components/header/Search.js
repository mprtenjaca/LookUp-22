import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { GLOBALTYPES } from "../../redux/types/globalTypes";
import { getDataAPI } from "../../utils/fetchData";

import "../../assets/css/listing.css"
import "../../assets/css/sass/search.css"
import { SEARCH_TYPES } from "../../redux/reducers/searchReducer";

const Search = () => {
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState([]);

  const { auth, searchRed } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const [test, setTest] = useState(false);

  useEffect(() => {
    const url = new URLSearchParams(history.location.search);
    if(url.get('keywords')){
      setSearch(url.get('keywords'))
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault();

    history.push({
      pathname: "/search",
      search: "?keywords=" + search,
      // state: { listings: res.data }
    })
  };

  const handleClose = () => {

    setSearch("");
    setListings([]);
  };

  return (
    <>
      <form className="search_form" onSubmit={handleSearch}>
        <div className="inputgroup"> 
          <span className="material-icons" style={search ? {color: '#13c1ac'} : {color: '#b6b3b3'}}>search</span>
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={search}
            id="search"
            onChange={(e) =>
              setSearch(e.target.value)
            }
            
          />
        </div>
        {/* <div className="search_icon" style={{ opacity: search ? 0 : 0.3 }}>
          <span className="material-icons">search</span>
          <span>Enter to Search</span>
        </div> */}

        <div
          className="close_search"
          onClick={handleClose}
          style={{ opacity: search ? 1 : 0 }}
        >
          &times;
        </div>

        <button type="submit" style={{ display: "none" }}>
          Search
        </button>

        {/* {load && <img className="loading" src={LoadIcon} alt="loading" />} */}

      </form>
    </>
  );
};

export default Search;
