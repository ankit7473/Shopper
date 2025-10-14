import React from 'react'
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import offer_image from '../Assets/exclusive_image.png'
import './Offers.css'
const Offers = () => {
  return (
    <div className='offer'>
         <div className="offer-left">
           <div className='offer-left-content'>
               <p>Exclusive</p>
                   <p>Offers for you</p>
           </div>
           <p className='offers_subtext'>ONLY ON BEST SELLERS PRODUCTS</p>
           <div className='offer-left-button'>
               <button className='latest-collection-button'>Click now</button>
           </div>
         </div>
         <div className="offer-right">
       <img src={offer_image} alt="" />
         </div>
       </div>
  )
}

export default Offers
