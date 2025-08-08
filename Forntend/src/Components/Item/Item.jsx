import React from 'react'
import {Link} from 'react-router-dom'
import './item.css'
const Item = (props) => {
  return (
    <div className='item'>
        <h2>{props.category}</h2>
      <Link to={`/product/${props.id}`}><img onClick={window.scrollTo(0,0)} src={props.img} alt="" /></Link>
      <p className='name'>{props.name}</p>
      <div className='item-prices'>
        <p className='new_price'>${props.new_price}</p>
        <p className='old_price'>${props.old_price}</p>
        </div>
    </div>
  )
}

export default Item
