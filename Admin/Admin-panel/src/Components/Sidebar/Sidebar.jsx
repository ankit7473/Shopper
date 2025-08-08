import React from 'react'
import "./Sidebar.css"
import { Link } from 'react-router-dom'
import cart_item from "../../assets/Product_Cart.svg"
import product_list from "../../assets/Product_list_icon.svg"
const Sidebar = () => {
  return (
    <div className='Sidebar' >
      <Link to={'/addproduct'} style={{textDecoration:"none"}}>
      <div className="sidebar_items">
        <img src={cart_item} alt="" />
        <p>Add Product </p>
      </div>
      </Link>
      <Link to={'/listproduct'} style={{textDecoration:"none"}}>
      <div className="sidebar_items">
        <img src={product_list} alt="" />
        <p>List products </p>
      </div>
      </Link>
    </div>
  )
}

export default Sidebar
