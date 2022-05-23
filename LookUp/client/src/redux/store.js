import { Provider } from "react-redux";
import { applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import alertReducer from "./reducers/alertReducer";
import profileReducer from "./reducers/profileReducer";
import listingReducer from "./reducers/listingReducer";
import detailItemReducer from "./reducers/detailItemReducer";
import categoryReducer from "./reducers/categoryReducer";
import filterReducer from "./reducers/filterReducer";
import searchReducer from "./reducers/searchReducer";

const store = configureStore(
  { reducer: {
      auth: authReducer,
      alert: alertReducer,
      profile: profileReducer,
      listing: listingReducer,
      detailItem: detailItemReducer,
      categoryListings: categoryReducer,
      filters: filterReducer,
      searchRed: searchReducer
  } }
);

const DataProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default DataProvider;
