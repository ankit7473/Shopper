import React, { useContext } from 'react'
import logo from '../Assets/logo.png';
import cart from '../Assets/cart_icon.png';
import { useState } from 'react';
import './Navbar.css'
import { Link } from 'react-router-dom';
import { ShopContext } from '../../context/Context';
function Navbar() {
  const  [menu, setmenu] = useState("")
  const {getTotalItem}=useContext(ShopContext);
  const handleLogout =() => {
    localStorage.removeItem('auth-token');
    window.location.replace('/');
  }
  
  return (
    <div className='navbar'> 
      <div className='logo'>
   <Link to="/"> <img  src={logo} alt="" /></Link>
    <p className='logo_text'>SHOPPER</p>
      </div>

    <div className='nav-category-gen'>
      <ul>
        <li onClick={()=>{ setmenu("home")}} className='category'> <Link to="/">All</Link> {menu==="home"?<hr/>:<></>}</li>
        <li onClick={()=>{setmenu("mens")}} className='category'><Link to="/mens">Men</Link>{menu==="mens"?<hr/>:<></>}</li>
        <li onClick={()=>{setmenu("womens")}} className='category'><Link to="/womens">Women</Link>{menu==="womens"?<hr/>:<></>}</li>
        <li onClick={()=>{setmenu("kids")}} className='category'><Link to="/kids">Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
      </ul>
    </div>



    <div className="cart-button ">
      {localStorage.getItem('auth-token')?<Link to="/"><button onClick={handleLogout} className='Login_btn'>logout</button></Link>:<Link to="/login">  <button className='Login_btn'>Login</button></Link>}
     <Link to="/cart"><div className="cart">
       <img className='cart_img' src={cart} alt="" />
          <div className="cartcount ">
            {getTotalItem()}
         </div>
      </div></Link>
    </div>
    </div>
  )
}

export default Navbar
