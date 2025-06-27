import {Link} from "react-router-dom";
import {FaTrashAlt} from "react-icons/fa";
import type { cartItems } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart, removeCartItem } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";

type CartitemsProps={
   cartItems:cartItems;
   decrementHandler:( cartItems:cartItems)=>void;
   incrementHandler:( cartItems:cartItems)=>void;
   removeCartItemHandler:( productId:string)=>void;
};

const Cartitems = ({cartItems, decrementHandler, incrementHandler, removeCartItemHandler}:CartitemsProps) => {
  const {productId, name, price , photo , stock , quantity }=cartItems;

  const dispatch = useDispatch();

  decrementHandler =(cartItems:cartItems) =>{
    if(cartItems.quantity === 1 ) { toast.error("Minimum quantity is 1"); return ;}
     dispatch(addToCart({...cartItems , quantity:quantity-1 }));
  };
  incrementHandler =(cartItems:cartItems)=>{
    if(cartItems.quantity == cartItems.stock) { toast.error(`Maximum quantity is ${cartItems.stock} `); return ;}
    dispatch(addToCart({...cartItems , quantity:quantity+1 }));
  };
  removeCartItemHandler =(productId:string)=> {
    dispatch(removeCartItem(productId));
    toast.success("Item removed from cart");
  } 
  return (
    <div className="cart-items">
      <img src={photo} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>
      <div>
        <button onClick={()=>decrementHandler(cartItems)}>-</button>
        <p>{quantity}</p>
        <button onClick={()=>incrementHandler(cartItems)}>+</button>
      </div>
      <button onClick={()=>removeCartItemHandler(productId)}><FaTrashAlt/></button>
    </div>
  )
}

export default Cartitems;
