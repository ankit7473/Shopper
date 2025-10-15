import React, { useEffect, useState } from 'react'
import Item from '../Item/Item';
import './itemsCollection.css';
const ItemsCollection = () => {
  const[dataProduct,setDataProduct]=useState([]);
  useEffect(()=>{
   fetch('https://shopper-backend-delta.vercel.app/popularinwomen')  // ← CHANGED
   .then((res)=>res.json())
   .then((data)=>{
    setDataProduct(data);
   })
  },[])
  return (
    <div className='collections'>
        <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {dataProduct.map((item,i)=>{
            return <Item  key={i} id={item.id} name={item.name} img={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default ItemsCollection
