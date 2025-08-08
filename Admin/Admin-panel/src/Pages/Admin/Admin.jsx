import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import {Routes,Route} from 'react-router-dom';
import AddProducts from '../../Components/AddProduct/AddProducts';
import ListProducts from '../../Components/ListProducts/ListProducts';
const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <Routes>
        <Route path='/addproduct' element={<AddProducts/>}/>
        <Route path='/listproduct' element={<ListProducts/>}/>
      </Routes>
    </div>
  )
}

export default Admin
