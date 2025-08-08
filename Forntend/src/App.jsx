
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Cart from './Pages/Cart'
import Home from './Pages/Home'
import ShopCategories from './Pages/ShopCategories'
import Product from './Pages/Product'
import Footer from './Components/Footer/Footer'
import LogInSignUp from './Pages/LogInSignUp'
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'


function App() {
  return (
    <>
    <Router>
  <Navbar/>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/cart" element={<Cart/>}/>
    <Route path="/login" element={<LogInSignUp/>}/>
    <Route path="/mens" element={<ShopCategories banner={men_banner} category="men"/>}/>
    <Route path="/womens" element={<ShopCategories banner={women_banner} category="women"/>}/>
    <Route path="/kids" element={<ShopCategories banner={kid_banner} category="kid"/>}/>
    <Route path='/product' element={<Product/>}>
      <Route path=":productId" element={<Product/>}/>
    </Route>
  </Routes>
  <Footer/>
  </Router>
    </>
  )
}

export default App
