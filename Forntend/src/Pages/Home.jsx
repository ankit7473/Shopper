import React from 'react'
import Hero from '../Components/Hero/Hero'
import ItemsCollection from '../Components/ItemsCollection/ItemsCollection'
import Offers from '../Components/Offers/Offers'
import NewColllections from '../Components/NewCollections/NewColllections'
import Subscription from '../Components/SubscriptionBox/Subscription'
import Footer from '../Components/Footer/Footer'

const Home = () => {
  return (
    <div>
      <Hero/>
      <ItemsCollection/>
      <Offers/>
     <NewColllections/>
    <Subscription/>
    </div>
  )
}

export default Home
