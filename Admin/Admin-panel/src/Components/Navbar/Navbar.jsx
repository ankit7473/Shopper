import React from 'react'
import nav_logo from '../../assets/nav-logo.svg'
import profile_logo from '../../assets/nav-profile.svg'
import './Navbar.css'
const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="nav_logo">
        <img src={nav_logo} alt="" />
      </div>
      <div className="nav_profile">
        <img src={profile_logo} alt="" />
      </div>
    </div>
  )
}

export default Navbar
