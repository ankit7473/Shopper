import React, { useContext } from "react";
import "./Cartltems.css";
import { ShopContext } from "../../context/Context";
import remove_icon from "../Assets/cart_cross_icon.png";
const CartItems = () => {
  const { all_product, cartItem, removeFromcart ,getTotalAmount} = useContext(ShopContext);
  return (
    <div className="cartItems">
      <div className="cartItems_heading">
        <p>Product</p>
        <p>Title</p>
        <p>Prices</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      <div>
        {all_product.map((e) => {
          if (cartItem[e.id] > 0) {
            return (
              <div>
                <div className="cartItems_details cartItems_heading ">
                  <img
                    src={e.image}
                    alt=""
                    className="cartItems_product_image"
                  />
                  <p>{e.name}</p>
                  <p>${e.new_price}</p>
                  <button className="cartItems_button">{cartItem[e.id]}</button>
                  <p>${e.new_price * cartItem[e.id]}</p>
                  <img
                    onClick={() => {
                      removeFromcart(e.id);
                    }}
                    src={remove_icon}
                    alt=""
                    className="cartItems_product_remove_icon"
                  />
                </div>
                <hr />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
      
      
      <div className="cartItems_cart_total">

       <div className="cartItems_left_total">
         <h1>Cart Totals</h1>
        <div>
          <div className="cartItems_total_item">
            <p>Subtotal</p>
            <p>${getTotalAmount()}</p>
          </div>
          <hr />
          <div className="cartItems_total_item">
            <p>Shipping fee</p>
            <p>Free</p>
          </div>
          <hr />
          <div className="cartItems_total_item">
            <p>Total</p>
            <p>${getTotalAmount()}</p>
          </div>

          <button className="cartItems_proceed_btn">
            PROCEED TO CHECKOUT
          </button>
        </div>
        </div>


        <div className="cartItems_promo_code">
            <p>If you have a promo code,Enter it here</p>
            <div className="promo">
                <input type="text" placeholder="promo code" />
            <button>Sumbit</button>
            </div>
        </div>
     
      </div>
    </div>
  );
};

export default CartItems;
