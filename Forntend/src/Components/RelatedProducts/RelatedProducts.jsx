import React from 'react'
import './RelatedProducts.css'
import product_data from '../Assets/data'
import data_product from '../Assets/data'
import Item from '../Item/Item'
const RelatedProducts = () => {
  return (
    <div className='relatedProducts'>
        <h2>Related Products</h2>
        <div className='RelatedProducts_items'>
            {data_product.map((item,i)=>{
               return <Item key={i}  id={item.id} name={item.name} img={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
      
    </div>
  )
}

export default RelatedProducts
