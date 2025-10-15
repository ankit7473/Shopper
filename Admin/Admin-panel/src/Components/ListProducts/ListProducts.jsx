import React, { useEffect,useState } from 'react'
import './ListProducts.css'
import cross_icon from '../../assets/cross_icon.png'
const ListProducts = () => {
    let [allproducts, setallproducts] = useState([]);

    const fetchProducts= async() => {
        await fetch("https://shopper-backend-delta.vercel.app/allproducts").then((res)=>res.json())
        .then((data)=>{
            setallproducts(data);
        })
    }
    useEffect(()=>{
        fetchProducts();
    },[]);
    
    const handleDeleteProduct=async(id) => {
      await fetch("https://shopper-backend-delta.vercel.app/removeproduct",{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'

        },
        body:JSON.stringify({id:id})
      }).then((res)=>res.json()).then((data)=>{
        data.success?alert("Product removed"):alert("failed");
      })
      await fetchProducts();
    }
    
    
  return (
    <div className='listproducts'>
      <h1>All Products List</h1>
      <div className="listproducts_main">
        <p>Products</p>
        <p>Title</p>
        <p>Old price</p>
        <p>New price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproducts_products_details ">
      <hr />
        {allproducts.map((product)=>{
            return <> <div key={product.id} className="listproducts_items listproduct_main">
                <img  className="listproducts_product_img"style={{height:100}} src={product.image} alt="" />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img  onClick={()=>{handleDeleteProduct(product.id)}} className="products_details_remove_button" src={cross_icon} alt="" />
            </div>
            <hr />
            </>
        })}
      </div>
    </div>
  )
}

export default ListProducts
