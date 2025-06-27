import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { newPaymnetResponse } from '../../types/types';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/`,
  }),
  endpoints: (builder) => ({
    newPayment: builder.mutation<newPaymnetResponse, { amount: number }>({
      query: (payload) => ({
        url: 'create',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useNewPaymentMutation } = paymentApi; 