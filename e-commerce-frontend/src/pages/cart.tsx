import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import {Link} from "react-router-dom";
import Cartitems from "../components/cart-items";
import { useSelector } from "react-redux";
import type { cartReducerInitialStateTypes } from "../types/user-reducer";
import { useDispatch } from "react-redux";
import { addToCart, applyCoupon, calculateTotal, removeCartItem } from "../redux/reducer/cartReducer";
import { server } from "../redux/store";
import axios from 'axios';
import toast from "react-hot-toast";
import type { cartItems } from "../types/types";

const Cart = () => {
  const [couponcode , setCouponcode]=useState<string>("");
  const [isvalidcouponcode , setIsvalidcouponcode]=useState<boolean>(false);

 

  const { cartitems , loading , tax, shippingCharges, discount, total, shippingInfo , subtotal } = 
  useSelector((state : {cartReducer : cartReducerInitialStateTypes})=>state.cartReducer);

  const dispatch = useDispatch();

  const incrementHandler = (cartItem: cartItems) => {
    if(cartItem.quantity === cartItem.stock) {
      toast.error(`Maximum quantity is ${cartItem.stock}`);
      return;
    }
    dispatch(addToCart({...cartItem, quantity: cartItem.quantity + 1}));
  };

  const decrementHandler = (cartItem: cartItems) => {
    if(cartItem.quantity === 1) {
      toast.error("Minimum quantity is 1");
      return;
    }
    dispatch(addToCart({...cartItem, quantity: cartItem.quantity - 1}));
  };

  const removeCartItemHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
    toast.success("Item removed from cart");
  };

  useEffect (()=>{
     const {token , cancel }=axios.CancelToken.source(); // cancel token is used to cancel the request if the component is unmounted 
     // time -> 3:51:00
      const timeOutId = setTimeout(()=>{
         axios.get(
          `${server}/api/v1/payment/discount?code=${couponcode}` , {cancelToken:token}
         ).then((res)=>{
            dispatch(applyCoupon(res.data.discount));
            setIsvalidcouponcode(true);
            dispatch(calculateTotal());
         }).catch((e)=>{
          dispatch(applyCoupon(0));
           setIsvalidcouponcode(false);
           dispatch(calculateTotal());
         });
      },1000);

      return ()=>{
        clearTimeout(timeOutId);
        cancel();
        setIsvalidcouponcode(false);}
  },[couponcode])

  useEffect(()=>{
    dispatch(calculateTotal());
  },[cartitems])

  return (
    <div className="cart">
       <main>
           {cartitems.map((i)=>(
            <Cartitems 
              key={i.productId} 
              cartItems={i}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeCartItemHandler={removeCartItemHandler}
            />
          ))}
       </main>
       <aside>
         <p>subtotal ₹{subtotal}</p>
         <p>tax ₹{tax}</p>
         <p>shipping charges ₹{shippingCharges}</p>
         <p>
          discount : <em> -₹{discount}</em>
         </p>
         <p> <b>total ₹{total}</b></p>
         <input
          type="text"
          placeholder="Coupon code"
          value={couponcode}
          onChange={(e)=>setCouponcode(e.target.value)}
         />

         {couponcode && (isvalidcouponcode ? (
          <span className="green">₹{discount} off using coupon code {couponcode}</span>
         ) : (<span className="red"> invalid coupon code <VscError/> </span>))}      
        
        <Link to="/shipping" > checkout</Link>
       </aside>
    </div>
  )
}

export default Cart;
