import React from 'react'
import './Subscription.css'

const Subscription = () => {
  return (
    <div className='subscription'>
        <h1>Get Exclusive Offers On Your Email</h1>
        <p>Subscribe to our newsletter and stay updated</p>
        <div className="input-btn">
        <input type="text" placeholder='Your email id' />
        <button>Subscribe</button>
        </div>
    </div>
  )
}

export default Subscription
