import { createSlice   ,  type PayloadAction } from "@reduxjs/toolkit";
import type { cartReducerInitialStateTypes } from "../../types/user-reducer";
import type { cartItems } from "../../types/types";
import type { shippingInfo } from "../../types/types";

const initialState: cartReducerInitialStateTypes ={
    loading: false,
    cartitems: [],
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo:{
        address:"",
        city:"",
        state:"",
        country:"",
        pinCode:""
    },
}

export const cartReducer= createSlice({ 
    name:"cartReducer",
    initialState,
    reducers:{
        addToCart:(state , action:PayloadAction<cartItems>)=> {
            state.loading=true;
            const index=state.cartitems.findIndex((item)=>item.productId === action.payload.productId);
            if(index !== -1 ){state.cartitems[index]=action.payload;}
            else{
                state.cartitems.push(action.payload);
            }
            state.loading=false;
        }, 
        removeCartItem:(state , action:PayloadAction<string>) => {
            state.loading=true;
            state.cartitems=state.cartitems.filter((item)=>item.productId !== action.payload);
            state.loading=false;
        }, 
        calculateTotal:(state)=>{
            state.subtotal=state.cartitems.reduce((acc,item)=> acc+ item.price*item.quantity , 0);
            state.shippingCharges=state.subtotal > 1000 ? 200 : 0;
            state.tax=state.subtotal*0.18;
            state.discount;
            state.total=state.subtotal+state.shippingCharges+state.tax - state.discount;
        }, 
        applyCoupon : (state , action:PayloadAction<number>)=>{
            state.discount=action.payload;
        }, 
        saveShippingInfo:(state , action:PayloadAction<shippingInfo>)=>{
            state.shippingInfo=action.payload;
        },
        resetCart:()=>initialState
    }
});

export const {addToCart , removeCartItem , calculateTotal , applyCoupon , saveShippingInfo , resetCart} = cartReducer.actions;