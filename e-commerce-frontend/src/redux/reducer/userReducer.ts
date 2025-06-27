import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { userReducerInitialStateTypes } from "../../types/user-reducer";
import type { User } from "../../types/types";


const initialState: userReducerInitialStateTypes= {
    user:null,
    isloading:true
};

export const userReducer = createSlice({
    name:"userReducer",
    initialState, 
    reducers:{
     userExist:(state , action:PayloadAction<User>)=>{
        state.isloading=  false,
        state.user= action.payload
     },
     userNotExist:(state)=>{
        state.isloading=  false,
        state.user= null
     }
    }
});

export const {userExist, userNotExist} = userReducer.actions;