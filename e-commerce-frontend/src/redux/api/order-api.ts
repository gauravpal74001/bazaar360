import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import type { messageResponse } from "../../types/api-types";
import type {
  newOrderRequestType,
  AllOrdersResponse,
  updateOrderRequest,
  OrderDetailsResponse
} from "../../types/types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/order/`,
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    newOrder: builder.mutation<messageResponse, newOrderRequestType>({
      query: (order) => ({
        url: "new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders"],
    }),
    myorders: builder.query<AllOrdersResponse, string>({
      query: (user_id) => `my?user=${user_id}`,
      providesTags: ["orders"],
    }),
    adminOrders: builder.query<AllOrdersResponse, string>({
      query: (id) => `admin?id=${id}`,
      providesTags: ["orders"],
    }),
    orderDetails: builder.query<OrderDetailsResponse, string>({
      query: (id) => id,
      providesTags: ["orders"],
    }),
    updateOrder: builder.mutation<messageResponse, updateOrderRequest>({
      query: ({ order_id, user_id }) => ({
        url: `${order_id}?id=${user_id}`,
        method: "PUT",
      }),
      invalidatesTags: ["orders"],
    }),
    deleteOrder: builder.mutation<messageResponse, updateOrderRequest>({
      query: ({ order_id, user_id }) => ({
        url: `${order_id}?id=${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),
  }),
});

export const {
  useNewOrderMutation,
  useAdminOrdersQuery,
  useMyordersQuery,
  useOrderDetailsQuery,
  useDeleteOrderMutation, 
  useUpdateOrderMutation
} = orderApi;
