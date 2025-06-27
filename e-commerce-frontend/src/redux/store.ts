import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/user-api";
import { userReducer } from "./reducer/userReducer";
import { productApi  } from "./api/product-api";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/order-api";
import { paymentApi } from "./api/payment-api";
import {dashboardApi} from "./api/dashboard-api"

export const server = import.meta.env.VITE_SERVER_URL;

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [userReducer.name]: userReducer.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [cartReducer.name]: cartReducer.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware, productApi.middleware, orderApi.middleware, paymentApi.middleware , dashboardApi.middleware)
});

export type RootState= ReturnType<typeof store.getState>;