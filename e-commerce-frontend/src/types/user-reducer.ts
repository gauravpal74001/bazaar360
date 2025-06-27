import type { User } from "./types";
import type { cartItems } from "./types";
import type { shippingInfo } from "./types";

export interface userReducerInitialStateTypes{
    user:User | null, 
    isloading:boolean
}; 

export type cartReducerInitialStateTypes ={
    loading:boolean,
    cartitems: cartItems[],
    subtotal:number,
    tax:number,
    shippingCharges:number,
    discount:number,
    total:number,
    shippingInfo:shippingInfo
}