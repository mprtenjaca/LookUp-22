import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { register } from '../redux/actions/authAction'

const Register = () => {

    const { auth, alert } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()

    const initialState = { 
        firstName: '', 
        lastName: '', 
        username: '', 
        email: '', 
        oib: null,
        contactPhone: '',
        street: '', 
        streetNumber: '', 
        city: '',
        postalCode: '',
        county: '',
        password: '', 
        cf_password: ''
    }
    const [userData, setUserData] = useState(initialState)
    const { firstName, lastName, username, email, oib, contactPhone, street, streetNumber, city, postalCode, county, password, cf_password } = userData

    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)

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
        dispatch(register(userData))
    }

  return (
    <>
      <div className="container-fluid vh-100">
        <div className="">
          <div className="rounded d-flex justify-content-center loginCenter">
            <div className="col-lg-4 col-md-6 col-sm-12 shadow-lg p-5 bg-light">
              <div className="text-center">
                <h3 className="text-info">Registracija</h3>
              </div>
              <form method="POST" onSubmit={handleSubmit} className="loginForm">
                <div className="p-4 form-input-wrapper">
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-info">
                      <i className="bi bi-person-plus-fill text-white"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ime"
                      name="firstName"
                      value={firstName}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-info">
                      <i className="bi bi-person-plus-fill text-white"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Prezime"
                      name="lastName"
                      value={lastName}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-info">
                      <i className="bi bi-person-plus-fill text-white"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Korisničko ime"
                      name="username"
                      value={username}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-info">
                      <i className="bi bi-person-plus-fill text-white"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="E-mail"
                      name="email"
                      value={email}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-info">
                      <i className="bi bi-person-plus-fill text-white"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Lozinka"
                      name="password"
                      value={password}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-info">
                      <i className="bi bi-person-plus-fill text-white"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contact phone"
                      name="contactPhone"
                      value={contactPhone}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-info">
                      <i className="bi bi-person-plus-fill text-white"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="City"
                      name="city"
                      value={city}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-info">
                      <i className="bi bi-person-plus-fill text-white"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Postal code"
                      name="postalCode"
                      minLength={5}
                      maxLength={5}
                      value={postalCode}
                      onChange={handleChangeInput}
                    />
                  </div>
                  {/* <div className="input-group mb-3">
                    <span className="input-group-text bg-info">
                      <i className="bi bi-key-fill text-white"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Ponovi lozinku"
                      name="repeatPassword"
                      // value={repeatPassword}
                      // onChange={handleChangeInput}
                    />
                  </div> */}
                  <div className="text-center">
                    <button
                      className="btn btn-info text-center mt-2"
                      type="submit"
                    >
                      Registriraj se
                    </button>
                  </div>
                  <p className="text-center mt-5">
                    Već imaš profil?
                    <Link to="/" >Login Now</Link>
                  </p>
                  {/* <p className="text-center text-info">Forgot your password?</p> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register;