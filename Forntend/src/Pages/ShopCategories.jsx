import React, { useContext } from 'react'
import './CSS/ShopCategory.css';
import all_product from '../Components/Assets/all_product';
import sort_dropdown from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Item/Item';
import { ShopContext } from '../context/Context';
const ShopCategories = (props) => {
  const {all_product}=useContext(ShopContext);
  return (
    <div className='shopcategories'>
      <div className="banner">
      <img src={props.banner} alt="" />
      </div>
      
      <div className="shotpcategory_items">
        <div className="indexSort">
        <p>
          <span>Showing 1-12</span> out of 36 products
        </p>
        <div className='sort'>
          Sort by <img src={sort_dropdown} alt="" />
        </div>
      </div>
        <div className="shopcategory_items">
        {all_product.map((item,i)=>{
          if(props.category===item.category){
            return <Item  key={i} id={item.id} name={item.name} img={item.image} new_price={item.new_price} old_price={item.old_price} />
          }
          else{
            return (null);
          }
        })}
        </div>
      </div>
      <div className="explore">
        <button>Explore More</button>
      </div>
    </div>
  )
}

export default ShopCategories
