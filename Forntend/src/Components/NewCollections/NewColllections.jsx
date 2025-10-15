import React from 'react'
import Item from '../Item/Item';
import './NewCollections.css'
import { useEffect,useState } from 'react';
const NewColllections = () => {
  const [collection, setcollection] = useState([]);

  useEffect(()=>{
    fetch('https://shopper-backend-lake.vercel.app/newcollections')  // ← CHANGED
    .then((res)=>res.json())
    .then((data)=>{
      setcollection(data);
    })
  },[])
  return (
    <div className='newCollections'>
      <h1>NEW COLLECTIONS</h1>
      <hr/>
      <div className='items'>
        {collection.map((item,i)=>{
            return <Item key={i}  id={item.id} name={item.name} img={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default NewColllections
