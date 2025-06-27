import type { messageResponse } from "../types/api-types";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type  { SerializedError } from "@reduxjs/toolkit";
import {  type NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";


export type ResType ={
        data: messageResponse;
        error?: undefined;
    } | {
        data?: undefined;
        error: FetchBaseQueryError | SerializedError;
};

export const responseToast = (
    res:ResType,
    navigate:NavigateFunction,
    url:string
) =>{
    if("data" in res){
        toast.success(res.data?.message!);
        if(navigate) navigate(url);
    }
    else{
      const error = res.error as FetchBaseQueryError;
      const msg = error.data as messageResponse;
      toast.error(msg.message)
    }

};

export const getMonthsData =()=>{
    const getsixMonths : string[] = [];
    const gettwelveMonths : string[] = [];

    const currenDate= moment();
    currenDate.set("date",1);

    for(let i=0;i<6;i++){
        const date= currenDate.clone().subtract(i,"month");
        const month=date.format("MMMM");
        getsixMonths.unshift(month);
    }

    for(let i=0;i<12;i++){
        const date= currenDate.clone().subtract(i,"month");
        const month=date.format("MMMM");
        gettwelveMonths.unshift(month);
    }

    return {getsixMonths , gettwelveMonths};

}