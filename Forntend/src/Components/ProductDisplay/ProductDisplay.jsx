import React, { useContext } from 'react'
import './ProductDisplay.css'
import full_star from'../Assets/star_icon.png';
import no_star from'../Assets/star_dull_icon.png';
import { ShopContext } from '../../context/Context';
const ProductDisplay = (props) => {
    const{product}=props;
    const {addTocart}=useContext(ShopContext);

  return (
    <div className='ProductDisplay'>
      <div className='ProductDisplay_left'>
        <div className="productImgae_list">
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
        </div>
        <div className="productMain_image">
            <img src={product.image} alt="" />
        </div>
      </div>


      <div className="ProductDisplay_right">
        <h1>{product.name}</h1>
        <div className="rating">
            <img src={full_star} alt="" />
            <img src={full_star} alt="" />
            <img src={full_star} alt="" />
            <img src={full_star} alt="" />
            <img src={no_star} alt="" />
            <p>(120)</p>
        </div>
        <div className="prices">
            <p className="old_prices">${product.old_price}</p>
            <p className="new_prices">${product.new_price}</p>
        </div>
        <div className="productDisplay_right_description">
            A lightweight ,usually knitten ,pullover shirt ,close-fitting and with the a round neckline
            and short sleeves, worn as an undershirt or outer garment.
        </div>
        <div className="productDisplay_right_select_Size">
            <h2>Select Size</h2>
            <div className="size_box">
                <div className="size">
                S
            </div>
            <div className="size">
                M
            </div>
            <div className="size">
                L
            </div>
            <div className="size">
                XL
            </div>
            <div className="size">
                XLL
            </div>
            </div>
        </div>

        <div className="productDisplay_right_add_cart">
            <button onClick={()=>{addTocart(product.id)
            }}>ADD TO CART</button>
        </div>
        
        <div className="productDisplay_right_category">
            <p>Category </p>
            <span>:Men,T-shirt,Jacket</span>
        </div>
        <div className="productDisplay_right_tags">
            <p>Tag</p>
             <span>:Modern,Latest</span>
        </div>
      </div>
    </div>
  )
}

export default ProductDisplay
