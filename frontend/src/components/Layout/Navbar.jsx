import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../cat.png'

const Navbar = () => {
  return (
    <div>
      <nav className="navbar has-shadow" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <NavLink to={'/dashboard'} className="mx-2">
            <img src={logo} width="84" height="56" alt="logo" />
          </NavLink>
        </div>
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons"></div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
