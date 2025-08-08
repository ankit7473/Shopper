import React from 'react'
import './Breadcrums.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'
const Breadcrums = (props) => {
    const {product}=props;
  return (
    <div className='Breadcrums'>
     HOME 
     <img src={arrow_icon} alt="" />
     SHOP
     <img src={arrow_icon} alt="" />
     <p>{product.category}</p>
     <img src={arrow_icon} alt="" />
     <p>{product.name}</p>
    </div>
  )
}

export default Breadcrums
