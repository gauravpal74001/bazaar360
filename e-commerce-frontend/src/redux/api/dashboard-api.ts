import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type{ dashboardResponse  , PieChartResponse , barChartResponse , lineChartResponse} from "../../types/types";

export const dashboardApi = createApi({
    reducerPath:"dashboardApi",
    baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER_URL}/api/v1/dashboard`}),
    endpoints:(builder)=>({
      getDashboardData:builder.query<dashboardResponse,string>({
        query:(id)=> `/stats?id=${id}`, 
        keepUnusedDataFor:0
      }),

      getPieChartData:builder.query<PieChartResponse,string>({
        query : (id)=> `/pie?id=${id}`,
        keepUnusedDataFor:0
      }),

      getBarChartData:builder.query<barChartResponse,string>({
        query:(id)=>`/bar?id=${id}`,
        keepUnusedDataFor:0
      }),

      getLineChartData:builder.query<lineChartResponse,string>({
        query:(id)=>`/line?id=${id}`,
        keepUnusedDataFor:0
      })
      
    })

});


export const {useGetDashboardDataQuery,useGetPieChartDataQuery,useGetBarChartDataQuery,useGetLineChartDataQuery} = dashboardApi;