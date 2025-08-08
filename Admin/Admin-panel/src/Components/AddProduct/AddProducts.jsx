import React from 'react'
import'./AddProducts.css'
import upload_area from '../../assets/upload_area.svg'
import { useState } from 'react'
const AddProducts = () => {
    const [image, setimage] = useState(false);
    const [productDetails, setproductDetails] = useState({
        name:"",
        category:"kid",
        image:"",
        new_price:"",
        old_price:""
    })

    const imageHandler=(e) => {
      setimage(e.target.files[0]);
    }
    const  update=(e)=>{
        setproductDetails({...productDetails,[e.target.name]:e.target.value});
    }

    const handleAdd= async () => {
      // console.log(productDetails);
      let responseData;
      let product={...productDetails};
      let formData=new FormData();
      formData.append('product',image);
      let resp=await fetch('http://localhost:4000/upload',{
        method:'POST',
        headers:{
          Accept:'application/json',
        },
          body:formData
      } 
    )
    responseData =await resp.json();

    if(responseData.success){
      product.image=responseData.image_url;
      console.log(productDetails);
      await fetch('http://localhost:4000/addproduct',{
        method:'POST',
        headers:{
          Accept:"application/json",
          'Content-Type':"application/json"
        },
        body:JSON.stringify(product),
      }).then((resp)=>resp.json()).then((data)=>{
        {data.success?alert("Product added"):alert("failed")}
      })
    }
    }
    
  return (
    <div className='addProducts'>
      <div className="add_product_title">
        <p>Product title</p>
        <input type="text" placeholder='Type here' name="name" value={productDetails.name} onChange={update} />
      </div>
      <div className="add_product_prices">
        <div className="add_product">
        <p>Old prices</p>
        <input type="number"  name="old_price" placeholder='Type here' value={productDetails.old_price} onChange={update}/>
        </div>
        <div className="add_product">
        <p>New prices</p>
        <input type="number" placeholder='Type here' name="new_price" value={productDetails.new_price} onChange={update}/>
      </div>
      </div>
      <div className="add_product_category">
        <p>Product Category</p>
        <select name="category" className='category_selector'  value={productDetails.category} onChange={update}>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">kid</option>
        </select>
      </div>
      <div className="add_product_img">
        <label htmlFor="file_input">
            <img src={image?URL.createObjectURL(image):upload_area} alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file_input' hidden />
      </div>
      <button className="addproduct_btn" onClick={handleAdd}>ADD</button>
    </div>
  )
}

export default AddProducts
