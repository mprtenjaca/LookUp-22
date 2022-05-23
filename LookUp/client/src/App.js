
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './pages/Login';
import { refreshToken } from './redux/actions/authAction';
import Home from './pages/Home';
import Register from './pages/Register';
import Alert from './components/alert/Alert';
import Header from './components/header/Header';
import PrivateRouter from './assets/customRouter/privateRouter';
import PageRender from './assets/customRouter/pageRender';

function App() {

  const dispatch = useDispatch()

  const { auth } = useSelector(state => state)

  useEffect(() => {
    dispatch(refreshToken())

  }, [dispatch]);

  // useEffect(() => {
  //   if(auth.token){
  //     dispatch()
  //   }
  // }, [dispatch, auth.token])

  return (
    <Router>
      <Alert/>
      <div className="main">
        {auth.token && <Header />}

        <Route exact path="/" component={auth.token ? Home : Login} />
        <Route exact path="/register" component={Register} />


        <PrivateRouter exact path="/:page" component={PageRender} />
        <PrivateRouter exact path="/:page/:id" component={PageRender} />
      </div>
      
    </Router>
  );
}

export default App;
