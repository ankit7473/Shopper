import { createContext,useState,useEffect } from "react";
export const ShopContext = createContext(null);

const getDefaultCart = () => {
  const cart = {};
  for (let i = 0; i <= 300; i++) {
    cart[i] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const url="https://shopper-jiwn.vercel.app"
  const [cartItem, setcartItem] = useState(getDefaultCart());
  const [all_product, setAll_product] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/allproducts`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setAll_product(data);
        if(localStorage.getItem('auth-token')){
          fetch(`${url}/getallcart`,{
            method:'POST',
            headers:{
              Accept:"application/form-data",
              'auth-token':`${localStorage.getItem('auth-token')}`,
              'Content-Type':"application/json"
            }
          }).then((res)=>res.json()).then((data)=>setcartItem(data))
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchData();
  }, []);

  const addTocart = (id) => {
    setcartItem((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    if (localStorage.getItem('auth-token')) {
      fetch(`${url}/addtocart`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'id': id })
      })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.error('Error adding to cart:', error));
    }
  };

  const removeFromcart = (id) => {
    setcartItem((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    if (localStorage.getItem('auth-token')) {
      fetch(`${url}/removefromcart`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'id': id })
      })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.error('Error removing from cart:', error));
    }
  };

  const getTotalAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        let itemInfo = all_product.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItem[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalItem = () => {
    let totalItem = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        totalItem += cartItem[item];
      }
    }
    return totalItem;
  };

  const contextValue = { 
    all_product, 
    cartItem, 
    addTocart, 
    removeFromcart, 
    getTotalAmount, 
    getTotalItem 
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
