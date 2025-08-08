import React from 'react'
import logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pintester_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'
import './Footer.css'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer_logo">
        <img src={logo} alt="" />
        <p>SHOPPER</p>
      </div>
      <div className='footer_text'>
        <p>Company</p>
        <p>Products</p>
        <p>Offices</p>
        <p>About</p>
        <p>Contact</p>
      </div>
      <div className="footer_icons">
        <img src={instagram_icon} alt="" />
        <img src={pintester_icon}alt="" />
        <img src={whatsapp_icon}alt="" />
      </div>
      <hr />
      <p className='footer_last_text'>Copyright@2025-All Right Reserved</p>
    </div>
  )
}

export default Footer
