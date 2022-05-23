import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { login } from '../redux/actions/authAction';
import { useDispatch, useSelector } from 'react-redux'

import "../assets/css/fisco-custom.css";
import "../assets/css/login.css";

const Login = () => {


    const initialState = { email: '', password: '' }
    const [userData, setUserData] = useState(initialState)
    const { email, password } = userData

    const [typePass, setTypePass] = useState(false)

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        if(auth.token){
          history.push("/")
        }

    }, [auth.token, history])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({...userData, [name]:value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(login(userData))
    }

    return (
        <>
      <div className="container-fluid vh-100">
        <div className="">
          <div className="rounded d-flex justify-content-center loginCenter">
            <div className="col-lg-4 col-md-6 col-sm-12 shadow-lg p-5 bg-light">
              <div className="text-center">
                <h3 className="text-info">Sign In</h3>
              </div>
              <form method="POST" onSubmit={handleSubmit} className="loginForm">
                <div className="p-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-info">
                      <i className="bi bi-person-plus-fill text-white"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      value={email}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-info">
                      <i className="bi bi-key-fill text-white"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-info text-center mt-2"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                  <p className="text-center mt-5">
                    Don't have an account?
                    <Link to="/register"><span className="text-info">Sign Up</span></Link>
                  </p>
                  <p className="text-center text-info">Forgot your password?</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
    )
}

export default Login