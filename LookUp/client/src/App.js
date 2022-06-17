
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router";
import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './pages/Login';
import { refreshToken, test } from './redux/actions/authAction';
import Home from './pages/Home';
import Register from './pages/Register';
import Alert from './components/alert/Alert';
import Header from './components/header/Header';
import PrivateRouter from './assets/customRouter/privateRouter';
import PageRender from './assets/customRouter/pageRender';
import ScreenSize from './components/ScreenSize';
import { getNotifies } from './redux/actions/notifyAction';
import SocketClient from './socket/SocketClient';
import { socket } from './redux/socket';
import EditItem from './components/item/EditItem';

function App() {
  const dispatch = useDispatch()
  const { auth } = useSelector(state => state)

  useEffect(() => {
    dispatch(refreshToken())
  }, [dispatch]);

  useEffect(() => {
    if(auth.token){
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token]);

  return (
    <Router>
      <Alert/>
      {auth.token && <SocketClient socket={socket} />}
      <div className="main">
        {auth.token && <Header />}
        
        {auth.token && <ScreenSize />}

        <Route exact path="/" component={auth.token ? Home : Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/item/edit/:id" component={EditItem} />

        <PrivateRouter exact path="/:page" component={PageRender} />
        <PrivateRouter exact path="/:page/:id" component={PageRender} />
        
        {/* {auth.token && <Footer />} */}
      </div>
      
    </Router>
  );
}

export default App;
